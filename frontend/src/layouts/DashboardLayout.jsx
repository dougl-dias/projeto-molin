import PropTypes from 'prop-types'
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Users, LogOut, Menu, X } from 'lucide-react'

function DashboardLayout({ children }) {
  const { logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />
    },
    { to: '/clientes', label: 'Clientes', icon: <Users size={20} /> }
  ]

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 w-64 bg-blue-900 text-white transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300
          h-screen overflow-y-auto
          lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-screen p-6`}
      >
        {/* Cabeçalho da sidebar no mobile */}
        <div className='flex justify-between items-center mb-10 lg:hidden'>
          <h2 className='text-2xl font-bold'>Projeto Molin</h2>
          <button onClick={toggleSidebar} aria-label='Fechar menu'>
            <X size={24} />
          </button>
        </div>

        {/* Título da sidebar no desktop */}
        <h2 className='text-2xl font-bold mb-10 hidden lg:block'>
          Projeto Molin
        </h2>

        {/* Navegação */}
        <nav className='flex-1 space-y-2'>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)} // fecha menu no mobile ao clicar
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === link.to
                  ? 'bg-blue-700 text-white'
                  : 'hover:bg-blue-800 text-blue-100'
              }`}
            >
              {link.icon}
              <span className='text-base font-medium'>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Botão logout */}
        <button
          onClick={logout}
          className='mt-10 flex items-center gap-2 px-4 py-2 rounded-lg text-red-300 hover:text-white hover:bg-red-600 transition-colors'
        >
          <LogOut size={18} />
          <span className='font-medium'>Sair</span>
        </button>
      </aside>

      {/* Conteúdo principal */}
      <div className='flex-1 flex flex-col min-h-screen'>
        <header className='bg-white shadow p-4 flex justify-between items-center'>
          {/* Botão menu só no mobile */}
          <button
            onClick={toggleSidebar}
            className='lg:hidden text-gray-700'
            aria-label='Abrir menu'
          >
            <Menu size={28} />
          </button>
          <h1 className='text-lg font-semibold text-gray-800'>Dashboard</h1>
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
