import { useLocation, useNavigate } from 'react-router-dom'

export default function CsvPreviewPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const csvData = location.state?.csvData || []

  const hasData =
    Array.isArray(csvData) &&
    csvData.length > 0 &&
    typeof csvData[0] === 'object'

  if (!hasData) {
    return (
      <div className='p-6'>
        <h2 className='text-xl font-bold mb-4'>Nenhum dado CSV para exibir</h2>
        <button
          onClick={() => navigate(-1)}
          className='bg-blue-600 text-white px-4 py-2 rounded'
        >
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Visualização do CSV</h2>
      <div className='overflow-auto'>
        <table className='table-auto border-collapse border border-gray-300 w-full'>
          <thead>
            <tr>
              {Object.keys(csvData[0]).map((key) => (
                <th
                  key={key}
                  className='border border-gray-300 px-2 py-1 text-left bg-gray-100'
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className='border border-gray-300 px-2 py-1'>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate(-1)}
        className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
      >
        Voltar
      </button>
    </div>
  )
}
