let express = require("express");
let router = express.Router();
let recipeRouter = require("../api/recipe");
let productRouter = require("../api/product")
let cors = require("cors");

router.use(cors());

router.use("/recipe", recipeRouter);
router.use("/product", productRouter);

router.get("/", (req, res, next) => {
  res.send("in api route");
});

module.exports = router;
