// src/routes/authRoutes.js
import express from 'express'
import {
  register,
  login
} from '../controller/authController.js'
import { validateLogin } from '../middleware/validate.js'
import { validateRegister } from '../middleware/validateRegister.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)

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
