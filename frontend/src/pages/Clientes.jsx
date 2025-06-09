import { useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import ClientsTable from '../components/ClientsTable'
import CsvUploadPreview from '../components/CsvUploadPreview'
import EditClientModal from '../components/EditClientModal'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

export default function Clientes() {
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

  return (
    <DashboardLayout>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold text-gray-800'>Clientes</h1>
        <button
          onClick={handleAdd}
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded'
        >
          + Adicionar Cliente
        </button>
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
