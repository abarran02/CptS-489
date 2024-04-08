var express = require("express");
var router = express.Router();
var cors = require("cors");
const Recipe = require('../models/Recipe');

router.use(cors());

router.get("/", async (req, res, next) => {
  const recipes = await Recipe.findAll({
    attributes: ['id', 'name', 'image'],
    limit: 4
  });

  const data = {
    pageTitle: 'Home Page',
    recipes: recipes
  };

  res.render('Public/homePage', data);
});

router.get("/recipes", async (req, res, next) => {
  const recipes = await Recipe.findAll({
    attributes: ['id', 'name', 'image']
  });

  const data = {
    pageTitle: 'All Recipes',
    recipes: recipes
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
      recipe: recipe.dataValues
    }

    res.render('Public/recipe', data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
