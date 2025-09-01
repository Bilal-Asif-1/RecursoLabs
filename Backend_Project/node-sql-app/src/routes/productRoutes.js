const express = require('express');
const router = express.Router();
const { ProductController, ProductQueryController } = require('../controllers/product');
const auth = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', ProductQueryController.getAllProducts);
router.get('/category/:category', ProductQueryController.getProductsByCategory);

// Protected routes (authentication required)
router.use(auth);

// Get user's products (must come before /:id route)
router.get('/user/my-products', ProductQueryController.getUserProducts);

// Create product
router.post('/', ProductController.createProduct);

// Get Product by ID (must come after specific routes)
router.get('/:id', ProductController.getProductById);

// Update product
router.put('/:id', ProductController.updateProduct);

// Delete product
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
