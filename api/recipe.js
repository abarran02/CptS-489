let express = require('express');
let router = express.Router();
const Recipe = require('../models/Recipe');

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const recipe = await Recipe.findOne({
      where: {
        id: id
      },
      attributes: ['name', 'createdAt']
  });
    res.json(recipe);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      attributes: ['name', 'createdAt']
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router
