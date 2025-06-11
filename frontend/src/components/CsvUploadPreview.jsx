import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useCsv } from '../context/CsvContext'

function CsvUploadPreview({ onSaveSuccess }) {
  const { csvData, setCsvData, file, setFile } = useCsv()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (file) {
      console.log('Arquivo selecionado:', file.name)
    }
  }, [file])

  const handleFileChange = (e) => {
    setError('')
    setSuccessMsg('')
    setCsvData([])
    setFile(null)

    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV')
      return
    }

    setFile(selectedFile)

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target.result
      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')

      if (lines.length === 0) {
        setError('CSV vazio')
        return
      }

      const headers = lines[0].split(';').map((h) => h.trim())
      const rows = lines.slice(1).map((line) => {
        const values = line.split(';').map((v) => v.trim())
        const obj = {}
        headers.forEach((h, i) => {
          obj[h] = values[i] || ''
        })
        return obj
      })

      setCsvData(rows)
    }
    reader.readAsText(selectedFile)
  }

  const handleConfirm = async () => {
    if (!file) {
      setError('Selecione um arquivo antes de confirmar')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      const formData = new FormData()
      formData.append('csv_file', file)

      await axios.post('http://localhost:5000/api/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccessMsg('Arquivo enviado com sucesso!')
      onSaveSuccess?.()
      handleClear()

      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(
        err.response?.data?.error || 'Erro ao enviar arquivo para o backend'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleVisualizar = () => {
    if (csvData.length === 0) {
      setError('Nenhum dado para visualizar')
      return
    }
    navigate('/csv-preview', { state: { csvData } })
  }

  // Nova função para limpar tudo
  const handleClear = () => {
    setFile(null)
    setCsvData([])
    setError('')
    setSuccessMsg('')
  }

  return (
    <div className='mb-6'>
      <input
        id='csv-upload'
        type='file'
        accept='.csv'
        onChange={(e) => {
          handleFileChange(e)
          e.target.value = null
        }}
      />

      {file && (
        <span className='block mt-2 text-gray-700 font-medium'>
          {file.name}
        </span>
      )}

      {error && <p className='mt-2 text-red-500'>{error}</p>}
      {successMsg && <p className='mt-2 text-green-600'>{successMsg}</p>}

      {csvData.length > 0 && (
        <div className='mt-4 flex items-center gap-3'>
          <button
            className='bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-800 transition-colors'
            onClick={handleClear}
          >
            Limpar arquivo
          </button>

          <button
            className='bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition-colors'
            onClick={handleVisualizar}
          >
            Visualizar
          </button>

          <button
            className='bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors'
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Confirmar envio'}
          </button>
        </div>
      )}
    </div>
  )
}

CsvUploadPreview.propTypes = {
  onSaveSuccess: PropTypes.func
}

export default CsvUploadPreview
