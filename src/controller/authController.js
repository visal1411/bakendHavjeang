// src/controllers/authController.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'
const JWT_EXPIRE = '1d'

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, phone, password, usertype } = req.body

    if (!name || !phone || !password || !usertype) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Phone already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        usertype
      }
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        usertype: user.usertype
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body

    const user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid phone or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.usertype },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        usertype: user.usertype
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
