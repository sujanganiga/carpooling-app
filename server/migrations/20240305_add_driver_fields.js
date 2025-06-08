"use strict";
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: false,
  },
});

module.exports = {
  up: async () => {
    try {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS "carModel" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "carPlate" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "licenseNumber" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "carColor" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "carCapacity" INTEGER;
      `);
      console.log("Migration completed successfully");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },

  down: async () => {
    try {
      await sequelize.query(`
        ALTER TABLE users 
        DROP COLUMN IF EXISTS "carModel",
        DROP COLUMN IF EXISTS "carPlate",
        DROP COLUMN IF EXISTS "licenseNumber",
        DROP COLUMN IF EXISTS "carColor",
        DROP COLUMN IF EXISTS "carCapacity";
      `);
      console.log("Rollback completed successfully");
    } catch (error) {
      console.error("Rollback failed:", error);
      throw error;
    }
  },
};
