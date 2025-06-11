import PropTypes from 'prop-types'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

function DashboardLayout({ children }) {
  const { logout } = useAuth()

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='flex-1 flex flex-col min-h-screen'>
        <header className='bg-white shadow p-4 flex justify-between items-center'>
          <h1 className='text-lg font-semibold text-gray-800'>Dashboard</h1>

          <button
            onClick={logout}
            className='flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:text-white hover:bg-red-600 transition-colors'
          >
            <LogOut size={18} />
            <span className='font-medium'>Sair</span>
          </button>
        </header>

        <main className='flex-1 overflow-auto p-6'>{children}</main>
      </div>
    </div>
  )
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default DashboardLayout
