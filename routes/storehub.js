var express = require("express");
var router = express.Router();
var cors = require("cors");
const models = require('../models/models');
const { sessionChecker, adminChecker, storeChecker } = require('./sessionChecker');

router.use(express.static('StoreHub'));
router.use(cors());

router.get("/", storeChecker, (req, res, next) => {
    console.log(req.session.user);
    res.sendFile('index.html', {root:'public/StoreHub'});
});

router.get("/order-manage", storeChecker, (req, res, next) => {
    const data = {
      pageTitle: 'Order Management',
      session: req.session.user

    }
    res.render('Store/order-manage', data);
});

router.get("/inventory", storeChecker, async (req, res, next) => {
    const storeid = req.session.user.controlsStore;
    const products = await models.Product.findAll({
        where: { storeid },
        attributes: ['id','ingredientname', 'price', 'stock', 'amount', 'unit']
      });
    const data = {
      pageTitle: 'Inventory',
      products: products,
      session: req.session.user
    }
    res.render('Store/inventory', data);
});

router.post("/inventory/create", storeChecker, async (req, res, next) => {
    const storeid = req.session.user.controlsStore;
    try {
      await models.Product.create({
        storeid: storeid, // placeholder value for store
        ingredientname: req.body.itemName,
        price: req.body.price,
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

  router.get("/delete-product/:productid", storeChecker, async function(req, res, next) {
    try {
      const productId = req.params.productid; 
      await models.Product.destroy({
        where: {
          id: productId
        }
      })
      res.redirect("/storehub/inventory");
    } catch (error) {
      console.error('Error:', error);
      res.redirect('/storehub/inventory?msg=error');
    }
  });

module.exports = router;
