'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('blogs', 'year');
  }
};
