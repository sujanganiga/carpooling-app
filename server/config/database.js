// database.js
// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// // This will automatically read the correct URL from process.env.DATABASE_URL
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "postgres",
//   dialectOptions:
//     process.env.NODE_ENV === "production"
//       ? { ssl: { rejectUnauthorized: false } }
//       : {},
// });

// module.exports = sequelize;

const { Sequelize } = require("sequelize");
require("dotenv").config();

let config;

if (process.env.DATABASE_URL) {
  // Use connection string
  config = {
    connectionString: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: { rejectUnauthorized: false },
          }
        : {},
  };
} else {
  // Use individual variables
  config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: { rejectUnauthorized: false },
          }
        : {},
  };
}

const sequelize = new Sequelize(config);
module.exports = sequelize;
