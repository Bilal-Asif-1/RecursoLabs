const { Sequelize } = require("sequelize");
const config = require("../config/config.js");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'mysql', // Explicitly set dialect
    logging: false, // Set to console.log to see SQL queries
  }
);

// Import models
const User = require("./user.js")(sequelize, Sequelize.DataTypes);
const Product = require("./product.js")(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Product,
};
