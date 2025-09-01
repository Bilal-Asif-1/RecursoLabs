const express = require('express');
const router = express.Router();
const { AuthController, ProfileController } = require('../controllers/user');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', auth, ProfileController.getProfile);
router.put('/profile', auth, ProfileController.updateProfile);
router.put('/change-password', auth, ProfileController.changePassword);

module.exports = router;
