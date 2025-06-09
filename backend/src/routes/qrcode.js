const express = require('express')
const router = express.Router()
const { getQrCode } = require('../whatsapp')

router.get('/qrcode', (req, res) => {
  const qr = getQrCode()
  if (qr) {
    res.json({ qr })
  } else {
    res.status(503).json({ error: 'QR Code ainda não disponível' })
  }
})

module.exports = router
