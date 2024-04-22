let express = require("express");
let router = express.Router();
let cors = require("cors");
const models = require('../models/models');
const upload = require('./middleware/upload');
const { QueryTypes } = require("sequelize");
const { sessionChecker, adminChecker, storeChecker } = require('./middleware/sessionChecker');

router.use(express.static('StoreHub'));
router.use(cors());

router.get("/", storeChecker, (req, res, next) => {
    const data = {
      pageTitle: 'Store Hub',
      session: req.session.user
    };
    res.render('Store/hub', data);
});

router.get("/order-manage", storeChecker, async (req, res, next) => {
    const orders = await models.Order.findAll({
      attributes: ['orderid', 'productid', 'amount', 'userid', 'fulfilledAt']
    });

    const data = {
      pageTitle: 'Order Management',
      session: req.session.user,
      orders: orders
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

router.post("/inventory/create", storeChecker,  upload.single('file'), async (req, res, next) => {
  const storeid = req.session.user.controlsStore;
  try {
    const cb = (error) => {
      if (error) {
        throw error;
      }
    }
    const image = req.file ? req.file.path.replace("public", "") : null;
    
    await models.Product.create({
      storeid: storeid, // placeholder value for store
      ingredientname: req.body.itemName,
      price: req.body.price,
      stock: req.body.stock,
      amount: req.body.amount,
      unit: req.body.unit,
      image: image
    });

    res.redirect("/storehub/inventory");
  } catch (error) {
    res.status(500).json(error);
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

router.post("/fulfill", storeChecker, async function(req, res, next) {
  const orderid = req.body.buttonId.replace('f', '');
  
  try {
    let order = await models.Order.findOne({
      where: {
        orderid: orderid
      }
    });
  
    const currentTime = new Date();
    order.fulfilledAt = currentTime;
    order.changed('controlsStore', true);
    await order.save();

    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

module.exports = router;
