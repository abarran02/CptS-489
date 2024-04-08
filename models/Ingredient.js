const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Ingredient = sequelize.define('Ingredient', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  description: DataTypes.TEXT,
  image: DataTypes.STRING // image storage path
});

module.exports = Ingredient;
