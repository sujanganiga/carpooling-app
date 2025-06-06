"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("rides", "status", {
      type: Sequelize.ENUM("upcoming", "in-progress", "completed", "cancelled"),
      defaultValue: "upcoming",
    });

    await queryInterface.addColumn("bookings", "reviewed", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("users", "rating", {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("rides", "status");
    await queryInterface.removeColumn("bookings", "reviewed");
    await queryInterface.removeColumn("users", "rating");
  },
};
