import { User } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      auth: Omit<User, 'password'>
      token: string
    }
  }
}
