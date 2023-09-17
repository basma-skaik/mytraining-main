'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reports', 'user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      // TODO: remove this because we use soft delete //Done
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reports', 'user_id');
  },
};