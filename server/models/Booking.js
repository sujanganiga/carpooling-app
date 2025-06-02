const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rideId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rides",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
  }
);

module.exports = Booking;
