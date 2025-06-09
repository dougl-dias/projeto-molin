const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode')

let qrCodeBase64 = null
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
})

// Evento de geração do QR Code
client.on('qr', async (qr) => {
  qrCodeBase64 = await qrcode.toDataURL(qr)
  console.log('QR Code gerado, aguardando autenticação...')
})

client.on('ready', () => {
  console.log('✅ WhatsApp conectado com sucesso!')
})

client.on('auth_failure', (msg) => {
  console.error('Erro na autenticação', msg)
})

client.initialize()

module.exports = {
  client,
  getQrCode: () => qrCodeBase64
}
