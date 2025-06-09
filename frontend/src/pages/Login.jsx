import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('admin@email.com')
  const [password, setPassword] = useState('1234')
  const [showPassword, setShowPassword] = useState(false) // novo estado
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('') // Estado para mensagem de erro

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('') // limpa mensagem antes de tentar login

    try {
      const url = 'http://localhost:5000/api/auth/login'

      const response = await axios.post(url, {
        email,
        password
      })

      login(response.data.token)
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in'>
        <h2 className='text-3xl font-extrabold text-center text-blue-700 mb-6'>
          Bem-vindo de volta
        </h2>

        {errorMessage && (
          <div className='mb-4 py-4 px-3 text-center text-red-700 bg-red-100 rounded-lg border border-red-300'>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-5'>
          <div>
            <label className='text-sm font-medium text-gray-700'>E-mail</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='seu@email.com'
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className='text-sm font-medium text-gray-700'>Senha</label>
            <input
              type={showPassword ? 'text' : 'password'} // alterna o tipo aqui
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='••••••'
              required
              disabled={loading}
            />
          </div>
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='show-password'
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              disabled={loading}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='show-password'
              className='text-sm text-gray-700 select-none'
            >
              Mostrar senha
            </label>
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50'
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className='text-center text-sm text-gray-500 mt-6'>
          © 2025 RBaena &quot;Projeto Whatsapp&quot;. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  )
}
