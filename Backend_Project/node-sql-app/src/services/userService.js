
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (userData) => {
  const { name, email, password } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Create user
  const user = await User.create({ 
    name, 
    email, 
    password: hashedPassword 
  });

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


exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: ['id', 'name', 'email', 'createdAt']
  });
};


exports.getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: ['id', 'name', 'email', 'createdAt']
  });
};


exports.updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    return null;
  }

  // If password is being updated, hash it
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 12);
  }

  await user.update(userData);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
};

/**
 * Delete user
 * @param {number} id - User ID
 * @returns {Promise<boolean>} Success status
 */
exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    return false;
  }

  await user.destroy();
  return true;
};