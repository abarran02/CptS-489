const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Recipe extends Model {
    static async findRecipe(recipeid){
        try {
            const recipe = await Recipe.findByPk(recipeid)
            return recipe ? recipe : null;
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

Recipe.init({
  recipeid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Recipe'
});

module.exports = Recipe
