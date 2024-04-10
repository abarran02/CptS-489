const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Ingredient = sequelize.define('Ingredient', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  description: DataTypes.TEXT,
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: DataTypes.STRING // image storage path
});

module.exports = Ingredient;
