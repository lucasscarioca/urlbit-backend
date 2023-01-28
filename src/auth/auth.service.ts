import { User } from '@prisma/client'
import * as argon2 from 'argon2'
import { sign } from 'jsonwebtoken'
import { prisma } from '../database'
import AppError from '../errors/AppError'
import { LoginInput, loginSchema, RegisterInput, registerSchema } from './dto'

class AuthService {
  public async login(loginInput: LoginInput): Promise<{
    user: Omit<User, 'password' | 'remember_token'>
    token: string
  }> {
    const result = loginSchema.safeParse(loginInput)

    if (!result.success) {
      const issue = result.error.issues[0]
      throw new AppError(`${issue.path[0]}: ${issue.message}`)
    }

    const { email, password } = result.data

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      throw new AppError('Email or password is incorrect')
    }

    const passwordMatched = await argon2.verify(user.password, password)

    if (!passwordMatched) {
      throw new AppError('Email or password is incorrect')
    }

    const { password: _password, remember_token, ...userWithoutPassword } = user

    const token = sign(
      { user: userWithoutPassword },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '30d',
      },
    )

    return { user: userWithoutPassword, token }
  }

  public async register(registerInput: RegisterInput): Promise<{
    user: Omit<User, 'password' | 'remember_token'>
    token: string
  }> {
    const result = registerSchema.safeParse(registerInput)

    if (!result.success) {
      const issue = result.error.issues[0]
      throw new AppError(`${issue.path[0]}: ${issue.message}`)
    }

    const { email, password, name, accountName, username } = result.data

    const usernameExists = await prisma.account.findFirst({
      where: {
        username,
      },
    })

    if (usernameExists) {
      throw new AppError('Username already exists')
    }

    const emailExists = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!!emailExists) {
      throw new AppError('Email already exists')
    }

    const account = await prisma.account.create({
      data: {
        name: accountName,
        username,
      },
    })

    const passwordHash = await argon2.hash(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        role: 'OWNER',
        accountId: account.id,
      },
    })

    const { password: _password, remember_token, ...userWithoutPassword } = user

    const token = sign(
      { user: userWithoutPassword },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '30d',
      },
    )

    return { user: userWithoutPassword, token }
  }
}

export default AuthService
