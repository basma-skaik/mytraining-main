'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DashboardInvitations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dashboard_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Dashboard',
          key: 'id',
        },
      },
      invited_user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      inviting_user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('pending', 'accepted', 'declined'),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deleted_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DashboardInvitations');
  },
};
