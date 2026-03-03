import { body, validationResult } from 'express-validator'

export const validateRegister = [
  // Name
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim(),

  // Phone
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^0\d{8,9}$/).withMessage('Invalid phone number format'),

  // Password
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

  // User type
  body('usertype')
    .notEmpty().withMessage('User type is required')
    .isIn(['customer', 'mechanic']).withMessage('Invalid user type'),

  // Mechanic-specific fields
  body('working_hours')
    .if(body('usertype').equals('mechanic'))
    .notEmpty().withMessage('Mechanic must provide working_hours'),

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
