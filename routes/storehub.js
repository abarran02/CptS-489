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

module.exports = router;
