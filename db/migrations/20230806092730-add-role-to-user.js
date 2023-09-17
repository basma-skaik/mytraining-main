'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: true, // Set to false if "role" is mandatory for all users
      defaultValue: 'user', // Set a default value if needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'role');
  }
};
