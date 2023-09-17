'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserDashboardShared', 'role', {
      type: Sequelize.STRING, // Define the role column
      defaultValue: 'user', // Set a default role if needed
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserDashboardShared', 'role');
  },
};
