let express = require("express");
let router = express.Router();
let cors = require("cors");
const models = require('../models/models');

router.use(cors());

router.post('/login', async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      where: {
        username: req.body.username,
        password: req.body.passwd
      },
      attributes: ['id', 'username', 'displayname', 'isAdmin', 'isChef']
    });

    // user failed to authenticate
    if (!user) {
      res.sendStatus(401);
    } else {
      req.session.user = user;
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/logout', (req, res, next) =>{
  if (req.session.user) {
    req.session.destroy();
  }

  res.redirect('/');
});

module.exports = router;
