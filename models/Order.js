const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('Order', {
  orderid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fulfilledAt: DataTypes.DATE
});

module.exports = Order;
