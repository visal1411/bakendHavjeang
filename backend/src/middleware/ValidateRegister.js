import { body, validationResult } from 'express-validator'
import { prisma } from '../config/db.js'

export const validateRegister = [
  // Name
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim(),

  // Phone
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^0\d{8,9}$/).withMessage('Invalid phone number format')
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({ where: { phone: value } })
      if (existingUser) {
        throw new Error("Phone already registered")
      }
      return true
    }),


  // Password
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

  // User type
  body('usertype')
    .notEmpty().withMessage('User type is required')
    .isIn(['customer', 'mechanic', 'Customer', 'Mechanic']).withMessage('Invalid user type'),

  // Mechanic-specific fields
  body('working_hours')
    .if(body('usertype').equals('mechanic'))
    .notEmpty().withMessage('Mechanic must provide working_hours')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/).withMessage('working_hours must in be hh:mm - hh:mm')
    .custom(value => {
    const parts = value.split('-');
    const [start, end] = parts.map(t => t.trim().split(':').map(Number));

  // Start before end
  if (start[0] > end[0] || (start[0] === end[0] && start[1] >= end[1])) {
    throw new Error('working_hours start must be before end');
  }

  return true;
}),

  body('mechanic_lat')
    .if(body('usertype').equals('mechanic'))
    .notEmpty().withMessage('Mechanic must provide location latitude'),

  body('mechanic_lng')
    .if(body('usertype').equals('mechanic'))
    .notEmpty().withMessage('Mechanic must provide location longitude'),

  // Error handling
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => err.msg)
      })
    }
    next()
  }
]
