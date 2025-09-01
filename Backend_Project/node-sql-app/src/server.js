const express = require("express");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const errorHandler = require("./middleware/errorHandler");
const responseHandler = require("./middleware/responseHandler");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);

// CORS middleware (for frontend integration)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Frontend static files serving removed - using Postman for API testing only

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      products: '/api/products'
    }
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// Default route now returns API information
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Server Running',
    documentation: 'Use Postman collection for testing endpoints'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    note: 'Please check the API documentation for valid endpoints'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📖 Health Check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.log('💡 Make sure MySQL is running and credentials are correct in .env file');
    process.exit(1);
  }
};

startServer();
