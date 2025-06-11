import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'
import CsvPreviewPage from '../components/CsvPreviewPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />

      {/* Rotas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/csv-preview' element={<CsvPreviewPage />} />
      </Route>

      {/* Redireciona rotas desconhecidas para login */}
      <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  )
}
