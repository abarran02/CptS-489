var express = require("express");
var router = express.Router();
var cors = require("cors");
const models = require('../models/models');
const { sessionChecker, adminChecker } = require('./sessionChecker');

router.use(express.static('StoreHub'));
router.use(cors());

router.get("/", (req, res, next) => {
    res.sendFile('index.html', {root:'public/StoreHub'});
});

router.get("/order-manage", (req, res, next) => {
    const data = {
      pageTitle: 'Order Management',
      session: req.session.user

    }
    res.render('Store/order-manage', data);
});

router.get("/inventory", (req, res, next) => {
    const data = {
      pageTitle: 'Inventory',
      session: req.session.user
    }
    res.render('Store/inventory', data);
});

router.post("/inventory/create", async (req, res, next) => {
    const { itemName, pricing, stock, amount, image } = req.body;
  
    try {
      await models.Product.create({
        storeid:1, // placeholder value for store
        ingredientname: req.body.itemName,
        price: req.body.pricing,
        stock: req.body.stock,
        amount: req.body.amount,
        unit: req.body.unit,
        image: req.body.image
      });
    res.redirect("/storehub/inventory");
    } catch (error) {
      res.status(500).json(error);
      // res.redirect() error msg
    }
  });

module.exports = router;
