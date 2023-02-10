import { NextFunction, Request, Response } from "express";

import AppError from '@utils/errors/AppError'

export default function errorHandler(
  e: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(e)

  if (e instanceof AppError) {
    return res.status(e.statusCode).json({
      status: 'error',
      error: e.error
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
}
