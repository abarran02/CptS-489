const sequelize = require('../db');
const { DataTypes } = require('sequelize');

function isPositive(value) {
  if (value <= 0) {
    throw new Error('The integerColumn must be greater than 0');
  }
}

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  storeid: {
    // store that sells the product
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredientname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isPositive
    }
  },
  amount: {
    // amount of the ingredient, e.g. the "64" in 64 oz
    type: DataTypes.FLOAT,
    allowNull: false
  },
  unit: DataTypes.STRING, // unit of the amount, e.g. the "oz" in 64 oz
  image: DataTypes.STRING // image storage path
});

module.exports = Product;
