import express, { request } from 'express'
import path from 'path'
import cors from 'cors'

import './database/connection'
import routes from './routes'

const app = express()
app.use(express.json())
app.use(cors())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.listen(8080)