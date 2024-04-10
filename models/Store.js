const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  products: DataTypes.JSON,
});

module.exports = Store;
