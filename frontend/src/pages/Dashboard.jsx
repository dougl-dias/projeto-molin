import DashboardLayout from '../layouts/DashboardLayout'
import {
  Send,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Plus,
  QrCode
} from 'lucide-react'
import { useEffect, useState } from 'react'
import CsvUploadPreview from '../components/CsvUploadPreview'
import ClientsTable from '../components/ClientsTable'
import EditClientModal from '../components/EditClientModal'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState(null)
  const [qrVisible, setQrVisible] = useState(false)
  const [qrCodeValue, setQrCodeValue] = useState('')

  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const fetchClients = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:5000/api/clients')
      setClients(res.data)
    } catch (err) {
      console.error('Erro ao buscar clientes', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleAdd = () => {
    setSelectedClient(null)
    setEditOpen(true)
  }

  const handleEdit = (client) => {
    setSelectedClient(client)
    setEditOpen(true)
  }

  const handleDelete = async (client) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o cliente ${client.name}?`
    )
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:5000/api/clients/${client.id}`)
      setClients((prev) => prev.filter((c) => c.id !== client.id))
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
    }
  }

  const handleClearApiData = async () => {
    if (confirm('Tem certeza que deseja remover TODOS os clientes?')) {
      try {
        await axios.delete('http://localhost:5000/api/clients?confirm=true') // ajuste a URL conforme seu sistema
        toast.success('Todos os clientes foram removidos com sucesso!')
        fetchClients()
      } catch (error) {
        console.error('Erro ao remover clientes:', error)
        toast.error('Erro ao remover os clientes.')
      }
    }
  }

  const handleSaveEdit = async (clientData) => {
    if (!clientData.name?.trim()) {
      toast.warn('O nome do cliente é obrigatório.')
      return
    }

    if (!clientData.company?.trim()) {
      toast.warn('O nome da empresa é obrigatório.')
      return
    }

    if (!clientData.phone?.trim()) {
      toast.warn('O telefone é obrigatório.')
      return
    }

    if (!clientData.email?.trim()) {
      toast.warn('O e-mail é obrigatório.')
      return
    }

    // Validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(clientData.email)) {
      toast.warn('Informe um e-mail válido.')
      return
    }

    setSaving(true)

    try {
      let url = `http://localhost:5000/api/clients`
      if (clientData.id) {
        // Atualização (PUT)
        url += `/${clientData.id}`
        await axios.put(url, clientData)
        setClients((prev) =>
          prev.map((c) => (c.id === clientData.id ? clientData : c))
        )
        toast.success('Cliente atualizado com sucesso!')
      } else {
        // Criação (POST)
        const res = await axios.post(url, clientData)
        setClients((prev) => [...prev, res.data])
        toast.success('Cliente criado com sucesso!')
      }

      setEditOpen(false)
      setSelectedClient(null)
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)

      const status = error.response?.status
      const message = error.response?.data?.message || 'Erro desconhecido'

      if (status === 400) {
        toast.error('Dados inválidos: ' + message)
      } else if (status === 404) {
        toast.error('Cliente não encontrado.')
      } else if (status === 500) {
        toast.error('Erro no servidor. Tente novamente mais tarde.')
      } else {
        toast.error('Erro ao salvar cliente: ' + message)
      }
    } finally {
      setSaving(false)
    }
  }

  const generateQRCode = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/qrcode')
      const data = await response.json()

      setQrCodeValue(data.qr)
      setQrVisible(true)
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error)
    }
  }

  const checkApiStatus = () => {
    setApiStatus('checking')
    setTimeout(() => {
      const success = Math.random() > 0.3
      setApiStatus(success ? 'connected' : 'disconnected')
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow p-6 flex items-center gap-3'>
          {apiStatus === 'connected' && (
            <CheckCircle className='text-green-500' size={32} />
          )}
          {apiStatus === 'disconnected' && (
            <XCircle className='text-red-500' size={32} />
          )}
          {apiStatus === 'checking' && (
            <RefreshCcw className='animate-spin text-gray-500' size={32} />
          )}
          {!apiStatus && <XCircle className='text-gray-400' size={32} />}

          <div>
            <h3 className='text-lg font-semibold text-gray-700 mb-1'>
              Status API
            </h3>
            <p
              className={`text-xl font-medium ${
                apiStatus === 'connected'
                  ? 'text-green-500'
                  : apiStatus === 'disconnected'
                    ? 'text-red-500'
                    : apiStatus === 'checking'
                      ? 'text-gray-500'
                      : 'text-gray-400'
              }`}
            >
              {apiStatus === 'connected' && 'Conectado'}
              {apiStatus === 'disconnected' && 'Desconectado'}
              {apiStatus === 'checking' && 'Verificando...'}
              {!apiStatus && 'Desconhecido'}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow p-6 mb-8'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>
          Ações Rápidas
        </h3>

        <div className='flex flex-wrap gap-4'>
          {/* Adicionar Manualmente */}
          <button
            onClick={handleAdd}
            className='bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors'
          >
            <Plus size={20} /> Adicionar Manualmente
          </button>

          {/* Enviar Mensagens */}
          <button
            onClick={''}
            className='bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors'
          >
            <Send size={20} /> Enviar Mensagens
          </button>

          {/* Gerar QR Code */}
          <button
            onClick={generateQRCode}
            className='bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-700 transition-colors'
          >
            <QrCode size={20} /> QRCode
          </button>

          {/* Atualizar Status da API */}
          <button
            onClick={checkApiStatus}
            className='bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-colors'
            disabled={apiStatus === 'checking'}
          >
            <RefreshCcw size={20} /> Atualizar Status
          </button>

          {/* Apagar Todos */}
          <button
            onClick={handleClearApiData}
            className='bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-700 transition-colors'
          >
            <XCircle size={20} /> Apagar Todos
          </button>
        </div>

        {/* Modal do QR Code */}
        {qrVisible && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative'>
              <button
                className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
                onClick={() => setQrVisible(false)}
              >
                &times;
              </button>
              <h2 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
                Escaneie o QR Code para conectar
              </h2>
              <div className='flex justify-center'>
                <img
                  src={qrCodeValue}
                  alt='QR Code do WhatsApp'
                  className='max-w-xs w-full h-auto rounded'
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='bg-white rounded-lg shadow p-6 mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Lista de Clientes
          </h3>
        </div>

        <CsvUploadPreview onSaveSuccess={fetchClients} />

        {loading ? (
          <p className='text-gray-500'>Carregando clientes...</p>
        ) : (
          <ClientsTable
            data={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <EditClientModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        client={selectedClient}
        onSave={handleSaveEdit}
        saving={saving}
      />

      <ToastContainer
        position='bottom-right'
        autoClose={4000}
        toastStyle={{ zIndex: 99999 }}
      />
    </DashboardLayout>
  )
}
