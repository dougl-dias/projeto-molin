require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const protectedRoutes = require('./routes/protected')
const uploadCsvRoutes = require('./routes/uploadCsv')
const clientsRoutes = require('./routes/clients')
const qrcodeRoutes = require('./routes/qrcode')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/protected', protectedRoutes)
app.use('/api/upload-csv', uploadCsvRoutes)
app.use('/api/clients', clientsRoutes.router)
app.use('/api/qrcode', qrcodeRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
