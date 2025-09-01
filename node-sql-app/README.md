- Key Project Components :
  
  - Database Setup : Sequelize is correctly configured in `database.js` for SQL database connection.
  - User Authentication : A user model ( `user.js` ), password hashing with bcryptjs , JWT generation/verification (likely in `authService.js` ), and authentication middleware ( `auth.js` ) are all in place.
  - CRUD Operations : Resource models ( `product.js` , `user.js` ) and dedicated controller functions for CRUD operations are present in the `controllers` directory.
  - Database Migrations : sequelize-cli is integrated for managing database schema changes, and migration scripts are located in the `migrations` directory.
  - Routing : Express Router is used to organize API endpoints into modular routes within the `routes` directory.
  - Configuration and Environment Variables : The project uses a .env file and dotenv for sensitive information, with centralized configuration modules in `app.js` and `config.js` .
  - Error Handling : Centralized error handling is implemented via `errorHandler.js` middleware.
- Example Project Flow : The existing structure and components fully support the described project flow.
- Project Files : The project's file and directory structure closely matches the example provided in your requirements.
Regarding unnecessary files, based on the current project structure and the requirements you've provided, there are no immediately apparent unnecessary files. The project appears to be well-structured and all files contribute to the outlined architecture and functionality.

#Node.js & SQL CRUD Project with JWT Authentication

A complete RESTful API built with Node.js, Express, MySQL, and Sequelize ORM, featuring user authentication with JWT tokens and full CRUD operations for products. The project follows a modular architecture for better organization and maintainability.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **CRUD Operations**: Complete Create, Read, Update, Delete operations for products
- **Database Migrations**: Sequelize migrations for database schema management
- **Data Seeding**: Demo data for testing
- **Error Handling**: Centralized error handling middleware
- **Input Validation**: Request validation using express-validator
- **JSDoc Comments Removed**: Cleaned up codebase by removing JSDoc comments for improved readability.
- **CORS Support**: Cross-Origin Resource Sharing using cors package
- **Pagination**: Built-in pagination for list endpoints
- **Search & Filtering**: Search products by name/description and filter by category
- **Authorization**: Route protection and user-specific operations
- **Service Layer**: Separation of business logic from controllers
- **Utility Helpers**: Common functions for response formatting and validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-sql-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the database configuration in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=crud_app
   DB_DIALECT=mysql
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   npm run migrate     # Run database migrations
   npm run seed        # Seed the database with sample data (optional)
   ```

## 📁 Project Structure

The project follows a modular architecture for better organization and maintainability:

```
node-sql-app/
├── .sequelizerc           # Sequelize configuration paths
├── package.json           # Project dependencies and scripts
├── server.js              # Application entry point
├── migrations/            # Database migrations
├── seeders/               # Database seed files
├── src/
│   ├── config/            # Configuration files
│   │   ├── config.js      # Database configuration
│   │   └── database.js    # Sequelize instance
│   ├── controllers/       # Request handlers
│   │   ├── base/          # Base controller classes
│   │   │   └── BaseController.js # Common controller functionality
│   │   ├── product/       # Product controllers
│   │   │   ├── ProductController.js # Product CRUD operations
│   │   │   ├── ProductQueryController.js # Product queries and filtering
│   │   │   └── index.js   # Product controllers export
│   │   ├── user/          # User controllers
│   │   │   ├── AuthController.js # Authentication operations
│   │   │   ├── ProfileController.js # User profile operations
│   │   │   ├── AdminController.js # Admin user operations
│   │   │   └── index.js   # User controllers export
│   │   └── index.js       # Controllers export
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js        # Authentication middleware
│   │   ├── errorHandler.js # Error handling middleware
│   │   ├── responseHandler.js # Response standardization middleware
│   │   ├── validationMiddleware.js # Input validation middleware
│   │   └── roleCheck.js   # Role-based authorization
│   ├── models/            # Database models
│   │   ├── index.js       # Models initialization
│   │   ├── product.js     # Product model
│   │   └── user.js        # User model
│   ├── routes/            # API routes
│   │   ├── authRoutes.js  # Authentication routes
│   │   ├── productRoutes.js # Product routes
│   │   └── userRoutes.js  # User routes
│   ├── services/          # Business logic
│   │   ├── authService.js # Authentication service
│   │   ├── productService.js # Product service
│   │   ├── userService.js # User service
│   │   └── index.js       # Services export
│   └── utils/             # Utility functions
│       ├── helpers/       # Helper functions
│       │   ├── responseFormatter.js # API response formatting
│       │   └── validationHelper.js  # Data validation
│       └── index.js       # Utils export
```

## 📦 `express-validator` Usage

The `express-validator` package is used for input validation in the following files:

- <mcfile name="server.js" path="c:\Users\belal\Desktop\RecursoLabs\Backend_Project\node-sql-app\src\server.js"></mcfile>: Used for importing `body` and `validationResult`.
- <mcfile name="validationMiddleware.js" path="c:\Users\belal\Desktop\RecursoLabs\Backend_Project\node-sql-app\src\middleware\validationMiddleware.js"></mcfile>: Used for importing `body`, `param`, `query`, and `validationResult` to define validation rules for various API endpoints.

## 🏗️ Architecture Improvements

The project has been restructured for better modularity and maintainability:

1. **Modular Controllers**: Organized controllers into domain-specific modules with a base controller class
2. **Service Layer**: Added a service layer to separate business logic from controllers
3. **Response Standardization**: Added response handler middleware for consistent API responses
4. **Input Validation**: Implemented express-validator for request validation
5. **CORS Handling**: Used cors package for proper CORS configuration
6. **Middleware Organization**: Moved middleware into the src directory for better organization
7. **Configuration Management**: Centralized configuration in src/config with separate modules for app and database settings
8. **Utility Functions**: Added helper utilities for common operations
9. **Role-Based Authorization**: Implemented role checking middleware for admin routes
10. **Centralized Routing**: Implemented a centralized route configuration system

These improvements make the codebase more maintainable, testable, and scalable.
   # Create database
   mysql -u root -p -e "CREATE DATABASE crud_app;"
   
   # Run migrations
   npm run db:migrate
   
   # Seed demo data (optional)
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile (Protected)
```http
PUT /auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Change Password (Protected)
```http
PUT /auth/change-password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

### Product Endpoints

#### Get All Products (Public)
```http
GET /products?page=1&limit=10&search=iphone&category=Electronics&sortBy=price&sortOrder=ASC
```

#### Get Product by ID (Public)
```http
GET /products/1
```

#### Get Products by Category (Public)
```http
GET /products/category/Electronics?page=1&limit=10
```

#### Create Product (Protected)
```http
POST /products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50
}
```

#### Update Product (Protected)
```http
PUT /products/1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Product",
  "description": "Updated description",
  "price": 89.99,
  "category": "Electronics",
  "stock": 45
}
```

#### Delete Product (Protected)
```http
DELETE /products/1
Authorization: Bearer <jwt_token>
```

#### Get User's Products (Protected)
```http
GET /products/user/my-products?page=1&limit=10
Authorization: Bearer <jwt_token>
```

### User Management Endpoints

#### Get All Users (Protected)
```http
GET /users
Authorization: Bearer <jwt_token>
```

#### Get User by ID (Protected)
```http
GET /users/1
Authorization: Bearer <jwt_token>
```

#### Delete User (Protected)
```http
DELETE /users/1
Authorization: Bearer <jwt_token>
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:seed` - Seed database with demo data
- `npm run db:seed:undo` - Remove seeded data
- `npm run db:reset` - Reset database (migrate + seed)

## 📁 Project Structure

```
node-sql-app/
├── migrations/            # Database migrations
├── seeders/               # Database seed files
├── src/
│   ├── config/            # Configuration files
│   │   ├── app.js         # Application configuration
│   │   ├── config.js      # Database configuration
│   │   └── database.js    # Sequelize instance
│   ├── controllers/       # Request handlers
│   │   ├── base/          # Base controller classes
│   │   │   └── BaseController.js # Common controller functionality
│   │   ├── product/       # Product controllers
│   │   │   ├── ProductController.js # Product CRUD operations
│   │   │   ├── ProductQueryController.js # Product queries and filtering
│   │   │   └── index.js   # Product controllers export
│   │   ├── user/          # User controllers
│   │   │   ├── AuthController.js # Authentication operations
│   │   │   ├── ProfileController.js # User profile operations
│   │   │   ├── AdminController.js # Admin user operations
│   │   │   └── index.js   # User controllers export
│   │   └── index.js       # Controllers export
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js        # Authentication middleware
│   │   ├── errorHandler.js # Error handling middleware
│   │   ├── responseHandler.js # Response standardization middleware
│   │   ├── validationMiddleware.js # Input validation middleware
│   │   └── roleCheck.js   # Role-based authorization
│   ├── models/            # Database models
│   │   ├── index.js       # Model associations
│   │   ├── user.js        # User model
│   │   └── product.js     # Product model
│   ├── routes/            # API routes
│   │   ├── index.js       # Centralized route configuration
│   │   ├── authRoutes.js  # Authentication routes
│   │   ├── userRoutes.js  # User management routes
│   │   └── productRoutes.js # Product CRUD routes
│   ├── services/          # Business logic
│   │   ├── userService.js # User service
│   │   ├── productService.js # Product service
│   │   └── index.js       # Services export
│   ├── utils/             # Utility functions
│   │   ├── helpers/       # Helper functions
│   │   └── index.js       # Utils export
│   └── server.js          # Main application file
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Register or login to get a JWT token
2. Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String, required)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Products Table
- `id` (Primary Key)
- `name` (String, required)
- `description` (Text, optional)
- `price` (Decimal, required)
- `category` (String, required)
- `stock` (Integer, required, default: 0)
- `userId` (Foreign Key to Users)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## 🧪 Testing with Postman

Import the provided Postman collection to test all API endpoints:

1. **Environment Setup**
   - Create a new environment in Postman
   - Add variable `baseUrl` with value `http://localhost:5000/api`
   - Add variable `token` (will be set automatically after login)

2. **Test Flow**
   - Register a new user
   - Login to get JWT token
   - Test protected endpoints with the token

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token expiration
- Input validation and sanitization
- SQL injection prevention (Sequelize ORM)
- CORS configuration
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.
