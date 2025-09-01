/**
 * User Admin Controller
 * Handles admin operations for user management
 */

const BaseController = require('../base/BaseController');
const { userService } = require('../../services');

class AdminController extends BaseController {
  /**
   * Get all users (Admin only)
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  getAllUsers = async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();

      return this.sendSuccess(res, 'Users retrieved successfully', { 
        users,
        count: users.length 
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const user = await userService.getUserById(id);

      if (!user) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, 'User retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const success = await userService.deleteUser(id);

      if (!success) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AdminController();