const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
// server/app.js
const path = require("path");

// Add this near other middleware
// Import models
const User = require("./models/User");
const Ride = require("./models/Ride");
const Booking = require("./models/Booking");

// Establish associations
User.hasMany(Ride, { foreignKey: "createdBy", as: "rides" });
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });

Ride.belongsTo(User, { foreignKey: "createdBy", as: "driver" });
Ride.hasMany(Booking, { foreignKey: "rideId", as: "bookings" });

Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
Booking.belongsTo(Ride, { foreignKey: "rideId", as: "ride" });

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const rideRoutes = require("./routes/rides");

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
    exposedHeaders: ["Content-Disposition"], // Keep this one
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/rides", rideRoutes);
// server/app.js
// Add this before your routes
// server/app.js
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// server/app.js
// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    utc: new Date().toUTCString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

module.exports = app;
