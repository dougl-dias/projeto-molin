import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const CsvContext = createContext(null) // colocar null explicitamente para detectar falta de provider

export function CsvProvider({ children }) {
  const [csvData, setCsvData] = useState([])
  const [file, setFile] = useState(null)

  return (
    <CsvContext.Provider value={{ csvData, setCsvData, file, setFile }}>
      {children}
    </CsvContext.Provider>
  )
}

CsvProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export function useCsv() {
  const context = useContext(CsvContext)
  if (!context) {
    throw new Error(
      'useCsv deve ser usado dentro de um CsvProvider. Verifique se seu componente está envolvido pelo CsvProvider.'
    )
  }
  return context
}
