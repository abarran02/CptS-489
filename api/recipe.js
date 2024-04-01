var express = require('express');
var router = express.Router();
const Recipe = require('../models/Recipe');

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
