const express = require('express');
const router = express.Router();
const { AdminController } = require('../controllers/user');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// Admin routes
router.get('/', auth, isAdmin, AdminController.getAllUsers);
router.get('/:id', auth, isAdmin, AdminController.getUserById);
router.delete('/:id', auth, isAdmin, AdminController.deleteUser);

module.exports = router;
