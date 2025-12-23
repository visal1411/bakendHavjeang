import { body, validationResult } from 'express-validator'

export const validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim(),

  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 8 }).withMessage('Invalid phone number'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('usertype')
    .notEmpty().withMessage('User type is required')
    .isIn(['customer', 'mechanic'])
    .withMessage('Invalid user type'),

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
