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
  const [qrLoading, setQrLoading] = useState(false)
  const [qrCodeValue, setQrCodeValue] = useState('')
  const [checkingConnection, setCheckingConnection] = useState(false)

  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const instanceName = 'molin'

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

  useEffect(() => {
    const interval = setInterval(() => {
      checkInstanceStatus()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!checkingConnection) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          'http://localhost:5000/api/evolution/instance_state',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ instance_name: instanceName })
          }
        )

        const data = await res.json()

        const state = data?.instance_status?.instance?.state

        // Aqui você pode usar "connected", "open", "qr_read_success", etc., dependendo dos estados que seu backend usa
        if (state === 'open') {
          toast.success('Instância conectada com sucesso!')
          setQrVisible(false)
          setCheckingConnection(false)
          setApiStatus('connected')
          clearInterval(interval)
        } else {
          setApiStatus('disconnected')
        }
      } catch (err) {
        console.error('Erro ao verificar estado da instância:', err)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [checkingConnection])

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
        await axios.delete('http://localhost:5000/api/clients?confirm=true')
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

  const sendMessages = async () => {
    if (!clients.length) {
      toast.warn('Nenhum cliente para enviar mensagem.')
      return
    }

    let sent = 0
    let failures = 0
    const failedClients = []
    const failedNames = []

    for (const client of clients) {
      const message = `Olá, ${client.name}! Tudo bem?

Aqui é da Molin. Estamos entrando em contato para apresentar uma solução que pode ajudar sua empresa a economizar tempo e ter mais controle sobre seus processos.

Oferecemos um sistema moderno de gestão que facilita o envio de mensagens, controle de clientes e integração com WhatsApp — tudo de forma simples e segura.

Se quiser conhecer melhor, posso te enviar mais informações ou agendar uma demonstração gratuita. O que acha?

Fico à disposição! 🙂`

      try {
        const res = await axios.post(
          'http://localhost:5000/api/evolution/send_message',
          {
            instance_name: instanceName,
            destination_number: client.phone,
            message: message
          }
        )

        if (res.status === 200) {
          try {
            await axios.delete(`http://localhost:5000/api/clients/${client.id}`)
          } catch (deleteError) {
            console.error(
              `Erro ao remover cliente ${client.name} do backend:`,
              deleteError
            )
            failedClients.push(client)
            failedNames.push(client.name)
            failures++
            continue
          }

          sent++
        } else {
          failures++
          failedClients.push(client)
          failedNames.push(client.name)
          console.warn(`Falha ao enviar para ${client.name}`, res.data)
        }
      } catch (error) {
        failures++
        failedClients.push(client)
        failedNames.push(client.name)
        console.error(`Erro ao enviar para ${client.name}:`, error)
      }
    }

    setClients(failedClients)

    if (failures > 0) {
      toast.warning(
        <div>
          <p>
            <b>{failures} contato(s) falharam:</b>
          </p>
          <ul style={{ textAlign: 'left', paddingLeft: 20 }}>
            {failedNames.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
          <b>Verifique os dados na tabela</b>
        </div>,
        {
          autoClose: false,
          closeOnClick: true
        }
      )
    }

    toast.success(
      <div>
        <p>
          <b>Mensagens enviadas!</b>
        </p>
        Enviadas com sucesso: {sent}
        <br />
        Falharam: {failures}
      </div>
    )
  }

  const generateQRCode = async () => {
    setQrLoading(true)
    try {
      const response = await fetch(
        'http://localhost:5000/api/evolution/create_instance'
      )
      const data = await response.json()

      console.log(data)

      setQrCodeValue(data.qrcode_base64)
      setQrVisible(true)
      setCheckingConnection(true) // inicia o polling após gerar o QR code
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error)
      toast.error('Erro ao gerar QR Code.')
    } finally {
      setQrLoading(false)
    }
  }

  const checkInstanceStatus = async () => {
    setApiStatus('checking')

    try {
      const res = await fetch(
        'http://localhost:5000/api/evolution/instance_state',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ instance_name: instanceName }) // ou outro nome
        }
      )

      const data = await res.json()
      const state = data?.instance_status?.instance?.state

      console.log('Estado da instância:', state)

      if (state === 'OPEN' || state === 'open') {
        setApiStatus('connected')
      } else {
        setApiStatus('disconnected')
      }
    } catch (error) {
      console.error('Erro ao checar status da instância:', error)
      setApiStatus('disconnected')
    }
  }

  return (
    <DashboardLayout>
      <div className='grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 mb-8'>
        {/* Status API - menor largura no desktop */}
        <div className='bg-white rounded-lg shadow p-6 flex items-center gap-3 max-h-[120px] md:max-h-none'>
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
                      : apiStatus === 'connecting'
                        ? 'text-yellow-500'
                        : 'text-gray-400'
              }`}
            >
              {apiStatus === 'connected' && 'Conectado'}
              {apiStatus === 'disconnected' && 'Desconectado'}
              {apiStatus === 'checking' && 'Verificando...'}
              {apiStatus === 'connecting' && 'Conectando...'}
              {!apiStatus && 'Desconhecido'}
            </p>
          </div>
        </div>

        {/* Ações Rápidas - maior espaço */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Ações Rápidas
          </h3>

          <div className='flex flex-wrap gap-4'>
            {/* botões aqui */}
            {/* Adicionar Manualmente */}
            <button
              onClick={handleAdd}
              className='bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors'
            >
              <Plus size={20} /> Adicionar Manualmente
            </button>

            {/* Enviar Mensagens */}
            <button
              onClick={sendMessages}
              disabled={saving || loading}
              className='bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50'
            >
              <Send size={20} /> Enviar Mensagens
            </button>

            {/* Gerar QR Code */}
            <button
              onClick={generateQRCode}
              disabled={qrLoading || apiStatus === 'connected'}
              className='bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-700 transition-colors disabled:opacity-50'
            >
              {qrLoading ? (
                <>
                  <RefreshCcw className='animate-spin' size={20} />
                  Gerando...
                </>
              ) : (
                <>
                  <QrCode size={20} />
                  QRCode
                </>
              )}
            </button>

            {/* Atualizar Status */}
            <button
              onClick={checkInstanceStatus}
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
        </div>
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
