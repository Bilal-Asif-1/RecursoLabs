/**
 * User Profile Controller
 */

const BaseController = require('../base/BaseController');
const { userService } = require('../../services');

class ProfileController extends BaseController {
  /**
   * Get current user profile
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  getProfile = async (req, res, next) => {
    try {
      const userId = req.userId;
      const user = await userService.getUserById(userId);

      if (!user) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, 'Profile retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  updateProfile = async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const userId = req.userId;

      const updatedUser = await userService.updateUser(userId, { name, email });
      
      if (!updatedUser) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(
        res, 
        'Profile updated successfully', 
        { user: updatedUser }
      );
    } catch (error) {
      if (error.message === 'Email already in use') {
        return this.sendError(res, error.message, 400);
      }
      next(error);
    }
  };

  /**
   * Change user password
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.userId;

      const success = await userService.changePassword(userId, currentPassword, newPassword);
      
      if (!success) {
        return this.sendError(res, 'Failed to change password', 400);
      }

      return this.sendSuccess(res, 'Password changed successfully');
    } catch (error) {
      if (error.message === 'Current password is incorrect' || 
          error.message === 'User not found') {
        return this.sendError(res, error.message, 400);
      }
      next(error);
    }
  };
}

module.exports = new ProfileController();