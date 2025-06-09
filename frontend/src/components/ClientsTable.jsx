import * as React from 'react'
import PropTypes from 'prop-types'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function ClientsTable({ data, onEdit, onDelete }) {
  function formatPhone(phone) {
    if (!phone) return ''
    // Remove tudo que não é número
    const digits = phone.replace(/\D/g, '')

    if (digits.length === 11) {
      // Celular com 9 dígitos: (XX) 9XXXX-XXXX
      return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    } else if (digits.length === 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    } else {
      // Caso não tenha 10 ou 11 dígitos, retorna original sem formatação
      return phone
    }
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Nome do cliente',
      flex: 1,
      minWidth: 150,
      filterable: true
    },
    {
      field: 'company',
      headerName: 'Nome da empresa',
      flex: 1,
      minWidth: 150,
      filterable: true
    },
    {
      field: 'phone',
      headerName: 'Telefone',
      flex: 1,
      minWidth: 150,
      filterable: true,
      renderCell: (params) => formatPhone(params.value)
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      filterable: true
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title='Editar'>
            <IconButton
              color='primary'
              onClick={() => onEdit(params.row)}
              size='small'
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Excluir'>
            <IconButton
              color='error'
              onClick={() => onDelete(params.row)}
              size='small'
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ]

  // Usa diretamente a prop 'data' para gerar as linhas
  const rows = (data || []).map((client) => ({
    id: client.id || '',
    name: client.name || '',
    company: client.company || '',
    phone: client.phone || '',
    email: client.email || ''
  }))

  if (!data) {
    return (
      <Box
        sx={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        components={{ Toolbar: GridToolbar }}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        showToolbar
      />
    </Box>
  )
}

ClientsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      company: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string
    })
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ClientsTable
