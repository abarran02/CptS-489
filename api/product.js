var express = require('express');
var router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll({
        attributes: ['ingredientname', 'price', 'stock', 'amount', 'unit']
    });
    res.json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res, next) => {
    //const { itemName, pricing, stock, amount, unit, image } = req.body;
  
    try {
      const product = await models.Product.create({
        storeid:1, // placeholder value for store
        ingredientname: req.body.itemName,
        price: req.body.pricing,
        stock: req.body.stock,
        amount: req.body.amount,
        unit: req.body.unit,
        image: req.body.image
      });
    res.json(product)
    } catch (error) {
      res.status(500).json(error);
    }
  });

module.exports = router
