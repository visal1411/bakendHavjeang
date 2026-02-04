// src/routes/authRoutes.js
import express from 'express'
import {
  register,
  login,
  checkSession,
  getProfileById
} from '../controller/authController.js'
import { validateLogin } from '../middleware/validate.js'
import { validateRegister } from '../middleware/validateRegister.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/check-session', authenticateToken, checkSession)
router.get('/users/:id/profile', getProfileById)

export default router

