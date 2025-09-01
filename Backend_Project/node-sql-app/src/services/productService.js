/**
 * Product Service - Handles business logic for products
 */

const { Product, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a new product
 * @param {object} productData - Product data
 * @param {number} userId - User ID
 * @returns {Promise<object>} Created product
 */
exports.createProduct = async (productData, userId) => {
  const { name, description, price, category, stock } = productData;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    userId
  });

  // Fetch the created product with user info
  return await Product.findByPk(product.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};

/**
 * Get all products with filtering, pagination and sorting
 * @param {object} options - Query options
 * @returns {Promise<object>} Products and count
 */
exports.getAllProducts = async (options) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    category, 
    sortBy = 'createdAt', 
    sortOrder = 'DESC' 
  } = options;
  
  const offset = (page - 1) * limit;
  
  // Build where clause
  const whereClause = {};
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (category) {
    whereClause.category = category;
  }

  // Get products with pagination
  const { count, rows: products } = await Product.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: offset,
    order: [[sortBy, sortOrder]],
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });

  return {
    products,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

/**
 * Get product by ID
 * @param {number} id - Product ID
 * @returns {Promise<object>} Product
 */
exports.getProductById = async (id) => {
  return await Product.findByPk(id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};

/**
 * Get products by category
 * @param {string} category - Product category
 * @returns {Promise<Array>} Products
 */
exports.getProductsByCategory = async (category) => {
  return await Product.findAll({
    where: { category },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};

/**
 * Get products by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Products
 */
exports.getUserProducts = async (userId) => {
  return await Product.findAll({
    where: { userId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};

/**
 * Update product
 * @param {number} id - Product ID
 * @param {object} productData - Updated product data
 * @param {number} userId - User ID
 * @returns {Promise<object>} Updated product
 */
exports.updateProduct = async (id, productData, userId) => {
  // Check if product exists and belongs to user
  const product = await Product.findOne({
    where: { id, userId }
  });

  if (!product) {
    return null;
  }

  // Update product
  await product.update(productData);

  // Return updated product with user info
  return await Product.findByPk(id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};

/**
 * Delete product
 * @param {number} id - Product ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
exports.deleteProduct = async (id, userId) => {
  // Check if product exists and belongs to user
  const product = await Product.findOne({
    where: { id, userId }
  });

  if (!product) {
    return false;
  }

  // Delete product
  await product.destroy();
  return true;
};