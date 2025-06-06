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
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "rejected",
        "completed",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    reviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
  }
);

// Define associations
Booking.associate = (models) => {
  Booking.belongsTo(models.Ride, { foreignKey: "rideId", as: "ride" });
  Booking.belongsTo(models.User, { foreignKey: "userId", as: "user" });
};

module.exports = Booking;
