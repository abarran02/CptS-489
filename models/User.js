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
  },
  displayname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cart: DataTypes.JSON,
  savedRecipes: DataTypes.JSON,
  portrait: {
    type: DataTypes.STRING, // image storage path
    defaultValue: "/uploads/default-profile.jpg"
  },
  controlsStore: DataTypes.INTEGER, // gives permission to login on StoreHub
  isAdmin: DataTypes.BOOLEAN,
  isChef: DataTypes.BOOLEAN
});

module.exports = User;
