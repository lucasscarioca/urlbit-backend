import { NextFunction, Request, Response } from 'express'
import AuthService from './auth.service'

class AuthController {
  public async login(request: Request, response: Response, next: NextFunction) {
    try {
      const authService = new AuthService()
      const { user, token } = await authService.login(request.body)

      return response.json({
        status: 'success',
        data: {
          user,
          token,
        },
      })
    } catch (e) {
      next(e)
    }
  }

  public async register(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const authService = new AuthService()
      const { user, token } = await authService.register(request.body)

      return response.json({
        status: 'success',
        data: { user, token },
      })
    } catch (e) {
      next(e)
    }
  }
}

export default AuthController
