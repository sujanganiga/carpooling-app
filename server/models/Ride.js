const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ride = sequelize.define(
  "Ride",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dropoffLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupLat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    pickupLng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    dropoffLat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    dropoffLng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    distance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Distance in kilometers",
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    arrivalTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    seatsAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      // ADD THIS NEW FIELD
      type: DataTypes.ENUM("upcoming", "in-progress", "completed", "cancelled"),
      defaultValue: "upcoming",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "rides",
    timestamps: true,
  }
);

// Define associations
Ride.associate = (models) => {
  Ride.belongsTo(models.User, { foreignKey: "createdBy", as: "driver" });
  Ride.hasMany(models.Booking, { foreignKey: "rideId", as: "bookings" });
};

module.exports = Ride;
