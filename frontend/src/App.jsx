import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import { CsvProvider } from './context/CsvContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <CsvProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </CsvProvider>
  )
}

export default App
