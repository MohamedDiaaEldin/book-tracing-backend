'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('books', {
      title: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      subtitle: {
        type: Sequelize.STRING
      },
      authors: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      publisher: {
        type: Sequelize.STRING
      },
      publishedDate: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('books');
  }
};
