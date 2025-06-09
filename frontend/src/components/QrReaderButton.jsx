import { useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { QrCode } from 'lucide-react'

export default function QrReaderButton() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const startScan = async () => {
    setScanning(true)
    const scanner = new Html5Qrcode('qr-reader')

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: 250
        },
        (decodedText) => {
          setResult(decodedText)
          scanner.stop()
          setScanning(false)
        },
        (errorMessage) => {
          console.warn('QR Scan erro:', errorMessage)
        }
      )
    } catch (err) {
      console.error('Erro ao iniciar leitura:', err)
      setScanning(false)
    }
  }

  return (
    <div>
      <button
        onClick={startScan}
        className='bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700'
      >
        <QrCode size={20} /> Ler QR Code
      </button>

      {scanning && (
        <div className='mt-4'>
          <div id='qr-reader' className='w-full max-w-md'></div>
        </div>
      )}

      {result && (
        <div className='mt-4 p-4 bg-green-100 text-green-800 rounded'>
          QR Lido: <strong>{result}</strong>
        </div>
      )}
    </div>
  )
}
