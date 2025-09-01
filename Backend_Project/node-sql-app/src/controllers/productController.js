const { productService } = require('../services');

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const userId = req.userId;

    const createdProduct = await productService.createProduct(productData, userId);

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
    const queryOptions = req.query;
    
    const result = await productService.getAllProducts(queryOptions);
    
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products: result.products,
        pagination: {
          total: result.count,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          limit: parseInt(queryOptions.limit || 10)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Product By ID
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await productService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

// Get Products By Category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    
    const products = await productService.getProductsByCategory(category);
    
    res.status(200).json({
      success: true,
      message: `Products in category '${category}' retrieved successfully`,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

// Get User Products
exports.getUserProducts = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const products = await productService.getUserProducts(userId);
    
    res.status(200).json({
      success: true,
      message: 'User products retrieved successfully',
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const userId = req.userId;
    
    const updatedProduct = await productService.updateProduct(id, productData, userId);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you are not authorized to update this product'
      });
    }
    
    res.status(200).json({
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
    
    const success = await productService.deleteProduct(id, userId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you are not authorized to delete this product'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
