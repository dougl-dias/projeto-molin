const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()

// Usuário fake para exemplo (em produção, buscar no banco)
const user = {
  id: 1,
  email: 'admin@email.com',
  passwordHash: bcrypt.hashSync('1234', 8) // senha "1234"
}

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (email !== user.email) {
    return res.status(401).json({ message: 'Email ou senha inválidos' })
  }

  const passwordIsValid = bcrypt.compareSync(password, user.passwordHash)
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Email ou senha inválidos' })
  }

  // Gerar token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  res.json({ token })
})

module.exports = router
