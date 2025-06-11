const express = require('express')
const router = express.Router()

let clients = []

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateClient(data) {
  const errors = []

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Nome é obrigatório e deve ser uma string válida.')
  }
  if (
    !data.company ||
    typeof data.company !== 'string' ||
    !data.company.trim()
  ) {
    errors.push('Empresa é obrigatória e deve ser uma string válida.')
  }
  if (!data.phone || typeof data.phone !== 'string' || !data.phone.trim()) {
    errors.push('Telefone é obrigatório e deve ser uma string válida.')
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.push('E-mail é obrigatório e deve ser uma string válida.')
  } else if (!isValidEmail(data.email)) {
    errors.push('E-mail inválido.')
  }
  return errors
}

function addClient(data) {
  const errors = validateClient(data)
  if (errors.length > 0) {
    return { errors }
  }
  const newId = clients.length ? Math.max(...clients.map((c) => c.id)) + 1 : 1
  const newClient = { id: newId, ...data }
  clients.push(newClient)
  return { client: newClient }
}

// POST para criar um novo cliente
router.post('/', (req, res) => {
  const { errors, client } = addClient(req.body)
  if (errors) {
    return res.status(400).json({ message: errors.join(' ') })
  }
  res.status(201).json(client)
})

// GET lista completa
router.get('/', (req, res) => {
  res.json(clients)
})

// GET cliente por id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const client = clients.find((c) => c.id === id)
  if (!client) {
    return res.status(404).json({ message: 'Cliente não encontrado' })
  }
  res.json(client)
})

// PUT para atualizar cliente
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const index = clients.findIndex((c) => c.id === id)
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' })
  }

  const errors = validateClient(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' ') })
  }

  const updatedClient = { ...clients[index], ...req.body }
  clients[index] = updatedClient
  res.json(updatedClient)
})

// DELETE para remover cliente
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const index = clients.findIndex((c) => c.id === id)
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado' })
  }

  clients.splice(index, 1)
  res.json({ message: 'Cliente excluído com sucesso' })
})

// DELETE para remover todos os clientes
router.delete('/', (req, res) => {
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmação necessária' })
  }

  clients.length = 0
  res.json({ message: 'Todos os clientes foram removidos com sucesso' })
})

module.exports = { router, addClient }
