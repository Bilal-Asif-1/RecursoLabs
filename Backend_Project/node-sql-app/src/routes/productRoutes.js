const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../../middleware/auth');

// Public routes (no authentication required)
router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);

// Protected routes (authentication required)
router.use(auth);

// Get user's products (must come before /:id route)
router.get('/user/my-products', productController.getUserProducts);

// Create product
router.post('/', productController.createProduct);

// Get Product by ID (must come after specific routes)
router.get('/:id', productController.getProductById);

// Update product
router.put('/:id', productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
