import * as dotenv from 'dotenv'
import express, { Express, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import AppError from './errors/AppError'
import { router } from './routes'
dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.use('/api', router)

app.use((err: Error, _: Request, response: Response, next: NextFunction) => {
  console.error(err)

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
