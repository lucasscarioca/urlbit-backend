import express from 'express'
import morgan from 'morgan'

import { router } from './routes'
import errorHandler from '@middlewares/ErrorHandler'

const app = express()
const port = process.env.PORT || '3000'

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Urlbit Server')
})

app.use('/api', router)

app.use(errorHandler)

app.listen(port, () => {
  console.info(`🚀 Server running on port http://localhost:${port}`)
})
