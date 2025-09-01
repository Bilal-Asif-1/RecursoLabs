const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../../middleware/auth");

// Protected routes - require authentication
router.use(auth);

// Get all users
router.get("/", userController.getAllUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
