const { Product, User } = require('../models');
const { Op } = require('sequelize');

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const userId = req.userId;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      userId
    });

    // Fetch the created product with user info
    const createdProduct = await Product.findByPk(product.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: createdProduct }
    });
  } catch (error) {
    next(error);
  }
};

// Get All Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
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

    const products = await Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(products.count / limit),
          totalItems: products.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    const userId = req.userId;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product
    if (product.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own products'
      });
    }

    await product.update({
      name,
      description,
      price,
      category,
      stock
    });

    // Fetch updated product with user info
    const updatedProduct = await Product.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product
    if (product.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own products'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get User's Products
exports.getUserProducts = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      where: { userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(products.count / limit),
          totalItems: products.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Products by Category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      where: { category },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(products.count / limit),
          totalItems: products.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
