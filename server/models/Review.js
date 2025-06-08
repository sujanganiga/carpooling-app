const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define(
  "Review",
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
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    revieweeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.STRING(500),
    },
    role: {
      type: DataTypes.ENUM("driver", "passenger"),
      allowNull: false,
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
  }
);

// Define associations
Review.associate = (models) => {
  Review.belongsTo(models.Ride, { foreignKey: "rideId", as: "ride" });
  Review.belongsTo(models.User, { foreignKey: "reviewerId", as: "reviewer" });
  Review.belongsTo(models.User, { foreignKey: "revieweeId", as: "reviewee" });
};

module.exports = Review;
