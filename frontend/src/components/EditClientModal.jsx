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

    if (digits.length > 11) {
      // Limita a 11 dígitos
      return formatPhone(digits.slice(0, 11))
    }

    if (digits.length <= 10) {
      // Fixo: (XX) XXXX-XXXX
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      // Celular: (XX) 9XXXX-XXXX
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
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
        phone: client.phone || '',
        email: client.email || ''
      })
    }
  }, [client])

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
    onSave({ ...client, ...form })
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
