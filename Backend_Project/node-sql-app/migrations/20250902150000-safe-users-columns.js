'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Table existence check (optional, agar table nayi create karni hai)
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('Users')) {
      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      });
    }

    // Column existence check
    const tableInfo = await queryInterface.describeTable('Users');
    if (!tableInfo.role) {
      await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user',
      });
    }

    // Add more columns safely
    if (!tableInfo.isActive) {
      await queryInterface.addColumn('Users', 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Users');

    // Remove columns if they exist
    if (tableInfo.role) {
      await queryInterface.removeColumn('Users', 'role');
    }
    if (tableInfo.isActive) {
      await queryInterface.removeColumn('Users', 'isActive');
    }

    // Drop table if exists (optional)
    const tables = await queryInterface.showAllTables();
    if (tables.includes('Users')) {
      await queryInterface.dropTable('Users');
    }
  }
};
