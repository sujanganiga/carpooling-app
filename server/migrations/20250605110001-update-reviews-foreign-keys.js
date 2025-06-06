"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop all existing foreign keys if they exist
    const constraints = [
      "reviews_userId_fkey",
      "reviews_reviewerId_fkey",
      "reviews_revieweeId_fkey",
      "reviews_rideId_fkey",
    ];

    for (const constraint of constraints) {
      try {
        await queryInterface.removeConstraint("reviews", constraint);
      } catch (error) {
        // Ignore error if constraint doesn't exist
        console.log(`Constraint ${constraint} not found, skipping...`);
      }
    }

    // Add the new foreign keys
    try {
      await queryInterface.addConstraint("reviews", {
        fields: ["reviewerId"],
        type: "foreign key",
        name: "reviews_reviewerId_fkey",
        references: {
          table: "users",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    } catch (error) {
      console.log("reviewerId constraint already exists, skipping...");
    }

    try {
      await queryInterface.addConstraint("reviews", {
        fields: ["revieweeId"],
        type: "foreign key",
        name: "reviews_revieweeId_fkey",
        references: {
          table: "users",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    } catch (error) {
      console.log("revieweeId constraint already exists, skipping...");
    }

    try {
      await queryInterface.addConstraint("reviews", {
        fields: ["rideId"],
        type: "foreign key",
        name: "reviews_rideId_fkey",
        references: {
          table: "rides",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    } catch (error) {
      console.log("rideId constraint already exists, skipping...");
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all foreign keys
    const constraints = [
      "reviews_reviewerId_fkey",
      "reviews_revieweeId_fkey",
      "reviews_rideId_fkey",
    ];

    for (const constraint of constraints) {
      try {
        await queryInterface.removeConstraint("reviews", constraint);
      } catch (error) {
        // Ignore error if constraint doesn't exist
        console.log(`Constraint ${constraint} not found, skipping...`);
      }
    }
  },
};
