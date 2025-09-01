const express = require('express');
const router = express.Router();
const { ProductController, ProductQueryController } = require('../controllers/product');
const auth = require('../middleware/auth');
const {
  productCreateValidation,
  productUpdateValidation,
  idParamValidation,
  paginationValidation
} = require('../middleware/validationMiddleware');

// Public routes (no authentication required)
router.get('/', paginationValidation, ProductQueryController.getAllProducts);
router.get('/category/:category', paginationValidation, ProductQueryController.getProductsByCategory);

// Protected routes (authentication required)
router.use(auth);

// Get user's products (must come before /:id route)
router.get('/user/my-products', paginationValidation, ProductQueryController.getUserProducts);

// Create product
router.post('/', productCreateValidation, ProductController.createProduct);

// Get Product by ID (must come after specific routes)
router.get('/:id', idParamValidation, ProductController.getProductById);

// Update product
router.put('/:id', idParamValidation, productUpdateValidation, ProductController.updateProduct);

// Delete product
router.delete('/:id', idParamValidation, ProductController.deleteProduct);

module.exports = router;
