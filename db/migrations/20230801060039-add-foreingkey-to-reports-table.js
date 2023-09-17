'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reports', 'dashboard_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Dashboard',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reports', 'dashboard_id');
  },
};