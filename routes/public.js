var express = require("express");
var router = express.Router();
var cors = require("cors");
const models = require('../models/models');
const sessionChecker = require('./sessionChecker');

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

router.get("/recipes/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const recipe = await models.Recipe.findOne({
      where: {
        id: id
      },
      attributes: ['name', 'image', 'ingredients', 'steps']
    });

    const data = {
      pageTitle: recipe.name,
      recipe: recipe,
      session: req.session.user
    }

    res.render('Public/recipe', data);
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
    attributes: ['id', 'name']
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
      attributes: ['id', 'storeid', 'name', 'price', 'stock', 'amount', 'unit', 'image']
    });

    const store = await models.Store.findOne({
      where: {
        id: product.storeid
      },
      attributes: ['name']
    });

    const data = {
      pageTitle: product.name,
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

    const products = await models.Product.findAll({
      where: {
        ingredientname: ingredient.name
      },
      attributes: ['id', 'name', 'amount', 'unit']
    });

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
  const cart = await models.User.findOne({
    where: {
      id: req.session.user.id
    },
    attributes: ['cart']
  });

  let cartproducts = [];
  let cartTotal = 0;
  // inefficient but handles duplicates unlike findAll()
  for (let i = 0; i < cart.cart.length; i++) {
    let product = await models.Product.findOne({
      where: {
        id: cart.cart[i]
      },
      raw: true
    });
    cartproducts.push(product);
    cartTotal += product.price;
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

router.post("/settings/change", sessionChecker, async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      where: {
        id: req.session.user.id
      }
    });

    // check user password
    if (req.body.curpasswd != user.password) {
      res.sendStatus(403);
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

      await user.save();
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
