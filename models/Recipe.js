const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ownerid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  steps: {
    type: DataTypes.JSON,
    allowNull: false
  },
  ingredients: {
    // defined as amount and ingredient id
    type: DataTypes.JSON,
    allowNull: false
  },
  image: DataTypes.STRING // image storage path
});

module.exports = Recipe;
