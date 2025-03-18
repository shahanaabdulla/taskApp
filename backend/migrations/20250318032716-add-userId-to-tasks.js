'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Delete all existing tasks
    await queryInterface.sequelize.query('DELETE FROM "Tasks"');

    // Step 2: Add the `userId` column as non-nullable
    await queryInterface.addColumn('Tasks', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false, // Make it non-nullable
      references: {
        model: 'Users',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Undo changes: remove the userId column
    await queryInterface.removeColumn('Tasks', 'userId');
  },
};
