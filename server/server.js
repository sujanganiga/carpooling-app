require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/database");
const User = require("./models/User");
const Ride = require("./models/Ride");
const Booking = require("./models/Booking");
const Review = require("./models/Review");

const PORT = process.env.PORT || 5000;

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Initialize model associations
    const models = { User, Ride, Booking, Review };

    // Call associate method for each model if it exists
    Object.values(models)
      .filter((model) => typeof model.associate === "function")
      .forEach((model) => model.associate(models));

    // Safe sync strategy
    await sequelize.sync({
      alter: process.env.NODE_ENV !== "production",
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
};

startServer();
