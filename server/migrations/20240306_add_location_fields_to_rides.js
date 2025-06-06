"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("rides", "pickupLat", {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("rides", "pickupLng", {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("rides", "dropoffLat", {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("rides", "dropoffLng", {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("rides", "distance", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "Distance in kilometers",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("rides", "pickupLat");
    await queryInterface.removeColumn("rides", "pickupLng");
    await queryInterface.removeColumn("rides", "dropoffLat");
    await queryInterface.removeColumn("rides", "dropoffLng");
    await queryInterface.removeColumn("rides", "distance");
  },
};
