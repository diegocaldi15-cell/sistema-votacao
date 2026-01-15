const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Option = sequelize.define(
  "Option",
  {
    text: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    timestamps: false,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

module.exports = Option;
