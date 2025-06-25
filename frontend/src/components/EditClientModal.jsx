import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'

export default function EditClientModal({
  open,
  onClose,
  client,
  onSave,
  saving
}) {
  function formatPhone(value) {
    if (!value) return ''

    const digits = value.replace(/\D/g, '')

    // DDI +55 + DDD + número
    if (digits.length > 13) {
      return formatPhone(digits.slice(digits.length - 13))
    }

    if (digits.length === 13) {
      // +55 (11) 91234-5678
      return digits.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4')
    }

    if (digits.length === 12) {
      // +55 (11) 1234-5678
      return digits.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, '+$1 ($2) $3-$4')
    }

    if (digits.length === 11) {
      // (11) 91234-5678
      return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }

    if (digits.length === 10) {
      // (11) 1234-5678
      return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    }

    return digits
  }

  function unmaskPhone(value) {
    return value.replace(/\D/g, '')
  }

  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name || '',
        company: client.company || '',
        phone: formatPhone(client.phone) || '',
        email: client.email || ''
      })
    } else {
      setForm({
        name: '',
        company: '',
        phone: '',
        email: ''
      })
    }
  }, [client, open])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'phone') {
      const formattedPhone = formatPhone(value)
      setForm({ ...form, [name]: formattedPhone })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = () => {
    const unmaskedPhone = unmaskPhone(form.phone)

    onSave({
      ...client,
      ...form,
      phone: unmaskedPhone
    })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Cliente</DialogTitle>
      <DialogContent>
        <TextField
          margin='dense'
          label='Nome'
          name='name'
          value={form.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin='dense'
          label='Empresa'
          name='company'
          value={form.company}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin='dense'
          label='Telefone'
          name='phone'
          value={form.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin='dense'
          label='Email'
          name='email'
          value={form.email}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color='primary'
          variant='contained'
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

EditClientModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  client: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    company: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string
  })
}
