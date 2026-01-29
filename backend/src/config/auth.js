// src/auth.js
import betterAuth from 'better-auth'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from './db.js'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = process.env.JWT_EXPIRE

export const auth = betterAuth({
  database: {
    // Called during login to find a user
    findUser: async (phone) => {
      return await prisma.user.findUnique({ where: { phone } })
    },
    // Called during registration
    createUser: async (userData) => {
      const { name, phone, password, usertype } = userData

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { phone } })
      if (existingUser) throw new Error('Phone already registered')

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await prisma.user.create({
        data: { name, phone, password: hashedPassword, usertype }
      })

      return user
    }
  },
  emailAndPassword: {
    enabled: true,
    // Customize login logic
    loginHook: async ({ user, password }) => {
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw new Error('Invalid phone or password')

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.usertype },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      )

      // Return the same response structure
      return {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          usertype: user.usertype
        }
      }
    }
  }
})
