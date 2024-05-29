'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserBooks', {
      userToken: {
        type: Sequelize.STRING,
        references: {
          model: 'users', // Reference the users table
          key: 'token',
        },
        primaryKey: true,
        allowNull: false,
      },
      bookId: {
        type: Sequelize.STRING,
        references: {
          model: 'books', // Reference the books table
          key: 'id', 
        },
        primaryKey: true,
        allowNull: false,
      },
      shelf: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserBooks');
  },
};
