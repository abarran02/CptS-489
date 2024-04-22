let express = require("express");
let router = express.Router();
let cors = require("cors");
const fs = require('fs');
const models = require('../models/models');
const { sessionChecker, adminChecker } = require('./middleware/sessionChecker');
const upload = require('./middleware/upload');
const { QueryTypes } = require("sequelize");

router.use(cors());

router.get("/", async (req, res, next) => {
  const recipes = await models.Recipe.findAll({
    attributes: ['id', 'name', 'image'],
    limit: 4
  });

  const chefs = await models.User.findAll({
    where: {
      isChef: true
    },
    attributes: ['id', 'displayname', 'portrait'],
    limit: 4
  })

  const data = {
    pageTitle: 'Home Page',
    recipes: recipes,
    chefs: chefs,
    session: req.session.user
  };

  res.render('Public/homePage', data);
});

router.get("/signup", async (req, res, next) => {
  const data = {
    pageTitle: 'Sign Up',
    session: req.session.user
  };

  if (data.session) {
    // user already logged in
    res.redirect('/');
  } else {
    res.render('Public/signup', data);
  }
});

router.post("/signup", async (req, res, next) => {
  const { username, displayname, password } = req.body;

  try {
    // attempt to create new User, if the username exists then send error
    models.User.findOrCreate({
      where: {
        username: username
      },
      defaults: {
        displayname: displayname,
        password: password
      }
    }).then(function(result) {
      const created = result[1];

      if (created) {
        res.redirect('/#signup-success');
      } else {
        res.sendStatus(202);
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/recipes", async (req, res, next) => {
  const recipes = await models.Recipe.findAll({
    attributes: ['id', 'name', 'image']
  });

  const data = {
    pageTitle: 'All Recipes',
    recipes: recipes,
    session: req.session.user
  }

  res.render('Public/recipeIndex', data);
});

router.get("/recipes/create", sessionChecker, async (req, res, next) => {
  const data = {
    pageTitle: 'Create New Recipe',
    session: req.session.user
  }

  res.render('Public/recipeCreate', data);
});

router.post("/recipes/create", sessionChecker, upload.single('file'), async (req, res, next) => {
  const { name, description, ingredients, steps } = req.body;

  console.log(req.body);

  const cb = (error) => {
    if (error) {
      throw error;
    }
  }

  try {
    const newRecipe = await models.Recipe.create({
      ownerid: req.session.user.id,
      name: name,
      description: description,
      steps: JSON.parse(steps),
      ingredients: JSON.parse(ingredients),
      image: req.file.path.replace("public", "")
    });

    res.status(200).send(`${newRecipe.id}`);
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, cb);
    }
    console.log(error)
    res.status(500).json(error);
  }
});

router.get("/recipes/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const recipe = await models.Recipe.findOne({
      where: {
        id: id
      },
      attributes: ['id', 'name', 'image', 'ingredients', 'steps']
    });

    if (!recipe) {
      res.redirect('/public/recipes');
    } else {
      const data = {
        pageTitle: recipe.name,
        recipe: recipe,
        session: req.session.user
      }

      res.render('Public/recipe', data);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/recipes/delete/:id", adminChecker, async (req, res, next) => {
  const id = req.params.id;

  try {
    await models.Recipe.destroy({
      where: {
        id: id
      }
    });

    res.redirect('/public/recipes');
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/users", async (req, res, next) => {
  const users = await models.User.findAll({
    attributes: ['id', 'displayname', 'portrait']
  });

  const data = {
    pageTitle: 'All Users',
    users: users,
    session: req.session.user
  }

  res.render('Public/userIndex', data);
});

router.get("/users/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await models.User.findOne({
      where: {
        id: id
      },
      attributes: ['displayname', 'portrait', 'savedRecipes']
    });

    const data = {
      pageTitle: user.name,
      user: user,
      session: req.session.user
    }

    res.render('Public/user', data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/stores", async (req, res, next) => {
  const stores = await models.Store.findAll({
    attributes: ['id', 'name', 'image']
  });

  const data = {
    pageTitle: 'All Stores',
    stores: stores,
    session: req.session.user
  }

  res.render('Public/storeIndex', data);
});

router.get("/stores/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const store = await models.Store.findOne({
      where: {
        id: id
      },
      attributes: ['name', 'description', 'image', 'location', 'products']
    });

    const products = await models.Product.findAll({
      where: {
        storeid: id
      },
      attributes: ['id', 'ingredientname', 'price']
    });

    const data = {
      pageTitle: store.name,
      store: store,
      products: products,
      session: req.session.user
    }

    res.render('Public/store', data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/products", async (req, res, next) => {
  const products = await models.Product.findAll({
    attributes: ['id', 'ingredientname']
  });

  const data = {
    pageTitle: 'All Products',
    products: products,
    session: req.session.user
  }

  res.render('Public/productIndex', data);
});

router.get("/products/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const product = await models.Product.findOne({
      where: {
        id: id
      },
      attributes: ['id', 'storeid', 'ingredientname', 'price', 'stock', 'amount', 'unit', 'image']
    });

    const store = await models.Store.findOne({
      where: {
        id: product.storeid
      },
      attributes: ['name']
    });

    const data = {
      pageTitle: product.ingredientname,
      product: product,
      store: store,
      session: req.session.user
    }

    res.render('Public/product', data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/ingredients", (req, res) => {
  res.redirect('/');
});

router.get("/ingredients/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const ingredient = await models.Ingredient.findOne({
      where: {
        name: id
      },
      attributes: ['name', 'description', 'category', 'image']
    });

    const sequelize = models.Product.sequelize;
    // without foreign key from Product storeid to Store table this is the only way to do it
    const products = await sequelize.query(
      'SELECT `p`.`id`, `p`.`ingredientname`, `p`.`amount`, `p`.`unit`, `s`.`name` AS `storename` FROM `Products` AS `p` JOIN `Stores` AS `s` ON `s`.`id`=`p`.`storeid` WHERE `p`.`ingredientname`=?',
      {
        replacements: [ingredient.name],
        type: QueryTypes.SELECT,
      }
    );

    const data = {
      pageTitle: ingredient.name,
      ingredient: ingredient,
      products: products,
      session: req.session.user
    }

    res.render('Public/ingredient', data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/cart", sessionChecker, async (req, res, next) => {
  const user = await models.User.findOne({
    where: {
      id: req.session.user.id
    },
    attributes: ['cart']
  });

  let cartproducts = [];
  let cartTotal = 0;
  if (user.cart) {
    // inefficient but handles duplicates unlike findAll()
    for (let i = 0; i < user.cart.length; i++) {
      let product = await models.Product.findOne({
        where: {
          id: user.cart[i]
        },
        raw: true
      });
      cartproducts.push(product);
      cartTotal += product.price;
    }
  }

  const data = {
    pageTitle: 'User Cart',
    cart: cartproducts,
    cartTotal: cartTotal,
    session: req.session.user
  }
  res.render('Public/cart', data);
});

router.post("/cart/add", sessionChecker, async (req, res, next) => {
  const productid = req.body.id;

  try {
    const product = await models.Product.findOne({
      where: {
        id: productid
      }
    });

    const user = await models.User.findOne({
      where: {
        id: req.session.user.id
      }
    });

    if (user.cart) {
      user.cart.push(productid);;
    } else {
      user.cart = [productid];
    }

    user.changed('cart', true);
    await user.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/myrecipes", sessionChecker, async (req, res, next) => {

  const userRecipes = await models.Recipe.findAll({
    where: {
      ownerid: req.session.user.id
    },
    attributes: ['id', 'name']
  });


  const data = {
    pageTitle: 'My Recipes',
    recipes: userRecipes,
    session: req.session.user
  }
  res.render('Public/myrecipes', data);
});


router.get("/settings", sessionChecker, async (req, res, next) => {
  const user = await models.User.findOne({
    where: {
      id: req.session.user.id
    },
    attributes: ['username', 'displayname', 'portrait']
  });

  const data = {
    pageTitle: 'Account Settings',
    user: user,
    session: req.session.user
  }

  res.render('Public/settings', data);
});

router.post("/settings/change", sessionChecker, upload.single('file'), async (req, res, next) => {
  const cb = (error) => {
    if (error) {
      throw error;
    }
  }

  try {
    const user = await models.User.findOne({
      where: {
        id: req.session.user.id
      }
    });

    // check user password
    if (req.body.curpasswd != user.password) {
      res.sendStatus(403);
      if (req.file) {
        // delete the file since we allowed upload anyway
        fs.unlink(req.file.path, cb);
      }
    } else {
      // check for changed values
      if (req.body.newpasswd && req.body.newpasswd != user.password) {
        user.password = req.body.newpasswd;
        user.changed('password', true);
      }

      if (req.body.displayname && req.body.displayname != user.displayname) {
        user.displayname = req.body.displayname;
        user.changed('displayname', true);
      }

      if (req.file) {
        // prevent deleting default image
        if (user.portrait != '/uploads/default-profile.jpg') {
          fs.unlink('public' + user.portrait, cb);
        }

        user.portrait = req.file.path.replace("public", "");
        user.changed('portrait', true);
      }

      await user.save();
      res.sendStatus(200);
    }
  } catch (error) {
    if (req.file) {
      // delete the file since we allowed upload anyway
      fs.unlink(req.file.path, cb);
    }
    res.status(500).json(error);
  }
});

router.get("/administration", adminChecker, async (req, res, next) => {
  const users = await models.User.findAll({
    attributes: ["id", "username", "displayname", "controlsStore", "isAdmin", "isChef"]
  });

  const stores = await models.Store.findAll({
    attributes: ["id", "name"]
  });

  const data = {
    pageTitle: 'Administration',
    users: users,
    stores: stores,
    session: req.session.user
  }

  res.render("Public/admin", data);
});

router.post("/ban", adminChecker, async (req, res, next) => {
  const userid = req.body.userid;

  try {
    await models.User.destroy({
      where: {
        id: userid
      }
    })

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/change/:id", adminChecker, async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await models.User.findOne({
      where: {
        id: id
      }
    });

    // this may seem too verbose but no reason to set user.changed unless it actually changes
    // check whether controlsStore is changed
    const setStores = (req.body.stores === 'none') ? null : req.body.stores;
    if (req.body.stores != setStores) {
      user.controlsStore = setStores;
      user.changed('controlsStore', true);
    }

    // check whether isChef is changed
    const setChef = req.body.chefbox === 'on';
    if (user.isChef != setChef) {
      user.isChef = setChef;
      user.changed('isChef', true);
    }

    // check whether isAdmin is changed
    const setAdmin = req.body.adminbox === 'on';
    if (user.isAdmin != setAdmin) {
      user.isAdmin = setAdmin;
      user.changed('isAdmin', true);
    }

    await user.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
