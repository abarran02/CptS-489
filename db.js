const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/recipedb.sqlite'
})

module.exports = sequelize
