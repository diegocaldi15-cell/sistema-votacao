const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vote = sequelize.define(
  "Vote",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = Vote;
