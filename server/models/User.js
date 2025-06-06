const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDriver: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "/default-profile.png",
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    // Driver specific fields
    carModel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    carPlate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    carColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    carCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10,
      },
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

// Define associations
User.associate = (models) => {
  User.hasMany(models.Ride, { foreignKey: "createdBy", as: "offeredRides" });
  User.hasMany(models.Booking, { foreignKey: "userId", as: "userBookings" });
};

module.exports = User;
