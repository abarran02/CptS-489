var express = require("express");
var router = express.Router();
var cors = require("cors");

router.use(cors());

router.get("/", (req, res, next) => {
    res.sendFile('homePage.html', {root:'public/Public'});
});

router.get("/recipes", (req, res, next) => {
    res.sendFile('recipeList.html', {root:'public/Public'});
});

module.exports = router;
