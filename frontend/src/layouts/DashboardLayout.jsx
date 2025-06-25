import PropTypes from 'prop-types'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

function DashboardLayout({ children }) {
  const { logout } = useAuth()

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      {/* Header */}
      <header className='bg-white shadow px-4 py-3 flex flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
        <h1 className='text-xl font-semibold text-gray-800'>Dashboard</h1>

        <button
          onClick={logout}
          className='flex items-center gap-2 px-4 py-2 rounded-md text-red-600 hover:text-white hover:bg-red-600 transition-colors text-sm sm:text-base'
        >
          <LogOut size={18} />
          <span className='font-medium'>Sair</span>
        </button>
      </header>

      {/* Conteúdo */}
      <main className='flex-1 p-4 sm:p-6 overflow-auto'>{children}</main>
    </div>
  )
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default DashboardLayout
