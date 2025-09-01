/**
 * Product Query Controller
 * Handles listing and filtering products
 */

const BaseController = require('../base/BaseController');
const { productService } = require('../../services');

class ProductQueryController extends BaseController {
  /**
   * Get all products with pagination
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  getAllProducts = async (req, res, next) => {
    try {
      const queryOptions = req.query;
      
      const result = await productService.getAllProducts(queryOptions);
      
      const pagination = {
        total: result.count,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: parseInt(queryOptions.limit || 10)
      };
      
      return this.sendPagination(
        res, 
        { products: result.products },
        pagination,
        'Products retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get products by category
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  getProductsByCategory = async (req, res, next) => {
    try {
      const { category } = req.params;
      
      const products = await productService.getProductsByCategory(category);
      
      return this.sendSuccess(
        res, 
        `Products in category '${category}' retrieved successfully`, 
        { products }
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's products
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  getUserProducts = async (req, res, next) => {
    try {
      const userId = req.userId;
      
      const products = await productService.getUserProducts(userId);
      
      return this.sendSuccess(
        res, 
        'User products retrieved successfully', 
        { products }
      );
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ProductQueryController();