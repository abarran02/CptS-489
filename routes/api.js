var express = require("express");
var router = express.Router();
var courseApiRouter = require("../api/recipe");
var cors = require("cors");

router.use(cors());

router.use("/recipe", courseApiRouter);

router.get("/", (req, res, next) => {
  res.send("in api route");
});

module.exports = router;
