/**
 * Validation Middleware
 * Provides validation rules and middleware for different routes
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.badRequest('Validation failed', errors.array());
  }
  next();
};

/**
 * User registration validation rules
 */
const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

/**
 * User login validation rules
 */
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Profile update validation rules
 */
const profileUpdateValidation = [
  body('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email address'),
  validate
];

/**
 * Password change validation rules
 */
const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate
];

/**
 * Product creation validation rules
 */
const productCreateValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('categoryId')
    .optional()
    .isInt().withMessage('Category ID must be an integer'),
  validate
];

/**
 * Product update validation rules
 */
const productUpdateValidation = [
  body('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
  body('description')
    .optional()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('categoryId')
    .optional()
    .isInt().withMessage('Category ID must be an integer'),
  validate
];

/**
 * ID parameter validation
 */
const idParamValidation = [
  param('id')
    .isInt().withMessage('ID must be an integer'),
  validate
];

/**
 * Pagination query validation
 */
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  passwordChangeValidation,
  productCreateValidation,
  productUpdateValidation,
  idParamValidation,
  paginationValidation,
  validate
};