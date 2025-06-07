// server/test-db.js
require("dotenv").config();
const sequelize = require("./config/database");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  } finally {
    await sequelize.close();
  }
})();
