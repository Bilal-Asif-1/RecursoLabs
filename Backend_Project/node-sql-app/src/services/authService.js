/**
 * Auth Service - Handles authentication business logic
 */

const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Login user
 * @param {object} credentials - User login credentials
 * @returns {Promise<object>} User and token
 */
exports.login = async (credentials) => {
  const { email, password } = credentials;

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );

  return {
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email 
    },
    token
  };
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Promise<object>} Decoded token
 */
exports.verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Generate new token
 * @param {object} user - User object
 * @returns {string} JWT token
 */
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );
};

/**
 * Change password
 * @param {number} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success status
 */
exports.changePassword = async (userId, currentPassword, newPassword) => {
  // Find user
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update password
  await user.update({ password: hashedPassword });
  
  return true;
};