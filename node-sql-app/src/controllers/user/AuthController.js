/**
 * User Authentication Controller
 */

const BaseController = require('../base/BaseController');
const { userService } = require('../../services');

class AuthController extends BaseController {
  /**
   * Register a new user
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  register = async (req, res, next) => {
    try {
      const userData = req.body;

      try {
        const result = await userService.register(userData);
        
        return this.sendSuccess(
          res, 
          'User registered successfully', 
          result, 
          201
        );
      } catch (error) {
        if (error.message === 'User with this email already exists') {
          return this.sendError(res, error.message, 400);
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  login = async (req, res, next) => {
    try {
      const credentials = req.body;

      try {
        const result = await userService.login(credentials);
        
        return this.sendSuccess(
          res, 
          'Login successful', 
          result
        );
      } catch (error) {
        if (error.message === 'Invalid credentials') {
          return this.sendError(res, error.message, 401);
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();