/**
 * Product Controller
 * Handles basic CRUD operations for products
 */

const BaseController = require('../base/BaseController');
const { productService } = require('../../services');

class ProductController extends BaseController {
  /**
   * Create a new product
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  createProduct = async (req, res, next) => {
    try {
      const productData = req.body;
      const userId = req.userId;

      const createdProduct = await productService.createProduct(productData, userId);

      return this.sendSuccess(
        res, 
        'Product created successfully', 
        { product: createdProduct }, 
        201
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get product by ID
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  getProductById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const product = await productService.getProductById(id);
      
      if (!product) {
        return this.sendError(res, 'Product not found', 404);
      }
      
      return this.sendSuccess(
        res, 
        'Product retrieved successfully', 
        { product }
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update product
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      const userId = req.userId;
      
      const updatedProduct = await productService.updateProduct(id, productData, userId);
      
      if (!updatedProduct) {
        return this.sendError(
          res, 
          'Product not found or you are not authorized to update this product', 
          404
        );
      }
      
      return this.sendSuccess(
        res, 
        'Product updated successfully', 
        { product: updatedProduct }
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete product
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next middleware function
   */
  deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
      
      const success = await productService.deleteProduct(id, userId);
      
      if (!success) {
        return this.sendError(
          res, 
          'Product not found or you are not authorized to delete this product', 
          404
        );
      }
      
      return this.sendSuccess(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ProductController();