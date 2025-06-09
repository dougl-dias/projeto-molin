import PropTypes from 'prop-types'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    // Tenta pegar token do localStorage ao iniciar app
    return localStorage.getItem('token') || null
  })

  // Quando token mudar, atualiza localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  // Função para logar: recebe token e salva no estado
  function login(receivedToken) {
    setToken(receivedToken)
  }

  // Função para deslogar
  function logout() {
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

// Hook para usar contexto mais fácil
export function useAuth() {
  return useContext(AuthContext)
}
