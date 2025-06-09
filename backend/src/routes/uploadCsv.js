const express = require('express')
const multer = require('multer')
const csv = require('csv-parser')
const stream = require('stream')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Importa addClient do clients.js
const { addClient } = require('./clients')

const iconv = require('iconv-lite')
const jschardet = require('jschardet')

router.post('/', upload.single('csv_file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo CSV não enviado' })
  }

  // Detecta a codificação do buffer do arquivo
  const detected = jschardet.detect(req.file.buffer)
  let decodedString

  if (detected.encoding && detected.encoding !== 'UTF-8') {
    // Converte para UTF-8 a partir da codificação detectada
    decodedString = iconv.decode(req.file.buffer, detected.encoding)
  } else {
    // Assume UTF-8 direto
    decodedString = req.file.buffer.toString('utf8')
  }

  const results = []
  const errors = []

  const readable = new stream.Readable()
  readable._read = () => {}
  readable.push(decodedString)
  readable.push(null)

  readable
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => {
      const cleanedData = {}
      for (const key in data) {
        cleanedData[key.trim()] =
          typeof data[key] === 'string' ? data[key].trim() : data[key]
      }

      const { errors: errs, client } = addClient(cleanedData)
      if (errs) {
        errors.push({ line: cleanedData, errors: errs })
      } else {
        results.push(client)
      }
    })
    .on('end', () => {
      res.json({
        message: 'Processamento do CSV finalizado',
        added: results.length,
        errors
      })
    })
    .on('error', (err) => {
      console.error('Erro ao processar CSV:', err)
      res.status(500).json({ error: 'Erro ao processar CSV' })
    })
})

module.exports = router
