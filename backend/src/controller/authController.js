// src/controllers/authController.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = process.env.JWT_EXPIRE

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, phone, password, usertype, working_hours, opening_hours} = req.body

    if (!name || !phone || !password || !usertype) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if(password.length < 8){
      return res.status(400).json({message: "password must be at least 8 characters long"});
    }
    const phoneRegex = /^0\d{8,9}$/

    if (!phoneRegex.test(phone)) {
    return res.status(400).json({
    message: 'Invalid phone number format'
    })
  }
        // 4️⃣ Mechanic hours validation **PUT YOUR CODE HERE**
    if (usertype === 'mechanic') {
      if (!working_hours || !opening_hours) {
        return res.status(400).json({ message: 'Mechanic must provide working_hours and opening_hours' })
      }

      // Example format: "08:00-17:00"
      const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/

      if (!hourRegex.test(working_hours)) {
        return res.status(400).json({ message: 'working_hours must be in HH:MM-HH:MM format (24h)' })
      }

      if (!hourRegex.test(opening_hours)) {
        return res.status(400).json({ message: 'opening_hours must be in HH:MM-HH:MM format (24h)' })
      }

      // Check that start time < end time
      const [wStart, wEnd] = working_hours.split('-').map(t => t.split(':').map(Number))
      const [oStart, oEnd] = opening_hours.split('-').map(t => t.split(':').map(Number))

      if (wStart[0] > wEnd[0] || (wStart[0] === wEnd[0] && wStart[1] >= wEnd[1])) {
        return res.status(400).json({ message: 'working_hours start must be before end' })
      }

      if (oStart[0] > oEnd[0] || (oStart[0] === oEnd[0] && oStart[1] >= oEnd[1])) {
        return res.status(400).json({ message: 'opening_hours start must be before end' })
      }
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
        usertype,
        working_hours: usertype === 'mechanic' ? working_hours : null,
        opening_hours: usertype === 'mechanic' ? opening_hours : null
      }
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        usertype: user.usertype,
        working_hours: user.working_hours,
        opening_hours: user.opening_hours

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
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    console.log('JWT Algorithm:', header.alg);


    res.json({
      message: 'Login successful',
      token,
      algorithm: header.alg, 
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
