const arrayData = require('./defaultdata.json');
const sequelize = require('../db');
const models = require('../models/models');

async function insertRecipes() {
  for (let i = 0; i < arrayData.recipes.length; i++) {
    const element = arrayData.recipes[i];
    await models.Recipe.create({
      name: element.name,
      description: element.description,
      ownerid: element.ownerid,
      steps: element.steps,
      ingredients: element.ingredients,
      image: element.image
    });
  }
}

async function insertIngredients() {
  for (let i = 0; i < arrayData.ingredients.length; i++) {
    const element = arrayData.ingredients[i];
    await models.Ingredient.create({
      name: element.name,
      description: element.description,
      image: element.image,
      category: element.category
    });
  }
}

async function insertStores() {
  for (let i = 0; i < arrayData.stores.length; i++) {
    const element = arrayData.stores[i];
    await models.Store.create({
      name: element.name,
      description: element.description,
      location: element.location
    });
  }
}

async function insertUsers() {
  for (let i = 0; i < arrayData.users.length; i++) {
    const element = arrayData.users[i];
    await models.User.create({
      username: element.username,
      password: element.password,
      displayname: element.displayname,
      controlsStore: element.controlsStore,
      isAdmin: (element.isAdmin === undefined) ? false : element.isAdmin,
      isChef: (element.isChef === undefined) ? false : element.isChef
    });
  }
}

async function insertProducts() {
  for (let i = 0; i < arrayData.products.length; i++) {
    const element = arrayData.products[i];
    await models.Product.create({
      storeid: element.storeid,
      name: element.ingredientname,
      ingredientname: element.ingredientname,
      price: element.price,
      stock: element.stock,
      amount: element.amount,
      unit: element.unit
    });
  }
}

sequelize.sync({ force: false }).then( async () => {
  console.log("Sequelize Sync Completed...");
  await insertRecipes();
  await insertIngredients();
  await insertStores();
  await insertUsers();
  await insertProducts();
});
