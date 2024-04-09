const arrayData = require('./recipes.json');
const sequelize = require('../db');
const Recipe = require('../models/Recipe')

sequelize.sync({ force: false }).then( async () => {
  console.log("Sequelize Sync Completed...");
  for (let i = 0; i < arrayData.length; i++) {
    const element = arrayData[i];
    await Recipe.create({
      name: element.name,
      description: element.description,
      ownerid: element.ownerid,
      steps: element.steps,
      ingredients: element.ingredients,
      image: element.image
    });
  }
});
