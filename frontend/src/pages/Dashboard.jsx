import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'
import { Send, RefreshCcw, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

const chartData = [
  { name: 'Seg', enviados: 120 },
  { name: 'Ter', enviados: 80 },
  { name: 'Qua', enviados: 150 },
  { name: 'Qui', enviados: 90 },
  { name: 'Sex', enviados: 110 }
]

const recentClients = [
  { nome: 'João Silva', empresa: 'Empresa X' },
  { nome: 'Maria Souza', empresa: 'Contábil Y' },
  { nome: 'Carlos Lima', empresa: 'Tech Z' }
]

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState(null)
  const [qrVisible, setQrVisible] = useState(false)
  const [qrCodeValue, setQrCodeValue] = useState('')

  const checkApiStatus = () => {
    setApiStatus('checking')
    setTimeout(() => {
      const success = Math.random() > 0.3
      setApiStatus(success ? 'connected' : 'disconnected')
    }, 1500)
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

  return (
    <DashboardLayout>
      <h1 className='text-2xl font-semibold text-gray-800 mb-6'>Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>
            Total de Clientes
          </h3>
          <p className='text-3xl font-bold text-blue-600'>254</p>
        </div>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>
            Mensagens Enviadas
          </h3>
          <p className='text-3xl font-bold text-blue-600'>932</p>
        </div>
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
          <button className='bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700'>
            <Send size={20} /> Enviar Mensagens
          </button>

          {/* Botão para gerar QR Code */}
          <button
            onClick={generateQRCode}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700'
          >
            {/* Ícone de QR Code (pode usar outro ou svg custom) */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 4h4v4H4V4zM10 4h4v4h-4V4zM16 4h4v4h-4V4zM4 10h4v4H4v-4zM10 10h4v4h-4v-4zM16 10h4v4h-4v-4zM4 16h4v4H4v-4zM10 16h4v4h-4v-4zM16 16h4v4h-4v-4z'
              />
            </svg>
            QRCode
          </button>

          {/* Botão para atualizar status da API */}
          <button
            onClick={checkApiStatus}
            className='bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700'
            disabled={apiStatus === 'checking'}
          >
            <RefreshCcw size={20} /> Atualizar Status
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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Envio de Mensagens (últimos dias)
          </h3>
          <ResponsiveContainer width='100%' height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='enviados' fill='#3B82F6' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-700 mb-4'>
            Últimos Clientes do CSV
          </h3>
          <ul className='space-y-2'>
            {recentClients.map((client, index) => (
              <li key={index} className='flex justify-between'>
                <span>{client.nome}</span>
                <span className='text-gray-500 text-sm'>{client.empresa}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
