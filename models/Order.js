const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  storeid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  products: {
    // defined as amounts and product ids
    type: DataTypes.JSON,
    allowNull: false
  },
  fulfilledAt: DataTypes.DATE
});

module.exports = Order;
