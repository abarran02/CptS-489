var express = require("express");
var router = express.Router();
var cors = require("cors");
const Recipe = require('../models/Recipe');
const User = require('../models/User');

router.use(cors());

router.get("/", async (req, res, next) => {
  const recipes = await Recipe.findAll({
    attributes: ['id', 'name', 'image'],
    limit: 4
  });

  const chefs = await User.findAll({
    where: {
      isChef: true
    },
    attributes: ['id', 'displayname', 'portrait'],
    limit: 4
  })

  const data = {
    pageTitle: 'Home Page',
    recipes: recipes,
    chefs: chefs,
    user: req.session.user
  };

  res.render('Public/homePage', data);
});

router.get("/recipes", async (req, res, next) => {
  const recipes = await Recipe.findAll({
    attributes: ['id', 'name', 'image']
  });

  const data = {
    pageTitle: 'All Recipes',
    recipes: recipes,
    user: req.session.user
  }

  res.render('Public/recipeList', data);
});

router.get("/recipes/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const recipe = await Recipe.findOne({
      where: {
        id: id
      },
      attributes: ['name', 'image', 'ingredients', 'steps']
    });

    const data = {
      pageTitle: recipe.dataValues.name,
      recipe: recipe.dataValues,
      user: req.session.user
    }

    res.render('Public/recipe', data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
