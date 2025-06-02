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

module.exports = Ride;
