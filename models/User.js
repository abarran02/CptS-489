const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  displayname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cart: DataTypes.JSON,
  savedRecipes: DataTypes.JSON,
  portrait: DataTypes.STRING, // image storage path
  isStore: DataTypes.BOOLEAN
});

module.exports = User;
