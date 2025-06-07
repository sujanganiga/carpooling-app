require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");
const User = require("./models/User");
const Ride = require("./models/Ride");
const Booking = require("./models/Booking");
const Review = require("./models/Review");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const runMigrations = async () => {
  try {
    const migrationsPath = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".js"))
      .sort();

    console.log("Running migrations...");

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migration = require(path.join(migrationsPath, file));
      await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
      console.log(`✅ Successfully ran migration: ${file}`);
    }

    console.log("All migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Run migrations
    await runMigrations();

    // Initialize model associations
    const models = { User, Ride, Booking, Review };

    // Call associate method for each model if it exists
    Object.values(models)
      .filter((model) => typeof model.associate === "function")
      .forEach((model) => model.associate(models));

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
};

startServer();
