/**
 * Base Controller Class
 * Provides common functionality for all controllers
 */

class BaseController {
  /**
   * Send success response
   * @param {object} res - Express response object
   * @param {string} message - Success message
   * @param {object} data - Response data
   * @param {number} statusCode - HTTP status code
   */
  sendSuccess(res, message = 'Operation successful', data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Send error response
   * @param {object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {object} errors - Additional error details
   */
  sendError(res, message = 'Operation failed', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send pagination response
   * @param {object} res - Express response object
   * @param {Array} data - Array of items
   * @param {object} pagination - Pagination details
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   */
  sendPagination(res, data = [], pagination = {}, message = 'Data retrieved successfully', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination
    });
  }

  /**
   * Handle async controller methods
   * @param {Function} fn - Async controller function
   * @returns {Function} Express middleware function
   */
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = BaseController;