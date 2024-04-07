var express = require("express");
var router = express.Router();
var recipeRouter = require("../api/recipe");
var cors = require("cors");

router.use(cors());

router.use("/recipe", recipeRouter);

router.get("/", (req, res, next) => {
  res.send("in api route");
});

module.exports = router;
