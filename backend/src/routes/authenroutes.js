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
