// src/routes/authRoutes.js
import express from 'express'
import {
  register,
  login,
  checkSession
} from '../controller/authController.js'
import { validateLogin } from '../middleware/Validate.js'
import { validateRegister } from '../middleware/ValidateRegister.js'
import { authenticateToken } from '../middleware/AuthMiddleware.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/check-session', authenticateToken, checkSession)

export default router

// src/routes/authRoutes.js
// import express from 'express'
// import { auth } from '../auth.js'

// const authRoutes = express.Router()

// authRoutes.post('/register', async (req, res) => {
//   try {
//     const user = await auth.emailAndPassword.register(req.body)
//     res.status(201).json(user)
//   } catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// })

// authRoutes.post('/login', async (req, res) => {
//   try {
//     const result = await auth.emailAndPassword.login(req.body)
//     res.json(result)
//   } catch (error) {
//     res.status(400).json({ message: error.message })
//   }
// })

// export default authRoutes
