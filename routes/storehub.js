var express = require("express");
var router = express.Router();
var cors = require("cors");

router.use(express.static('StoreHub'));
router.use(cors());

router.get("/", (req, res, next) => {
    res.sendFile('index.html', {root:'public/StoreHub'});
});

module.exports = router;
