const express = require('express');
const models = require('./models/models');
const sequelize = require('./db');
const session = require('express-session');
const cookieParser = require('cookie-parser');

var apiRouter = require('./routes/api');
var publicRouter = require('./routes/public');
var storeRouter = require('./routes/storehub');

const app = express();
const port = 3000;

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  name: 'huntergather',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 86400000 // 1 day
  }
}));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/api', apiRouter);
app.use('/public', publicRouter);
app.use('/public', express.static('./public/Public'));
app.use('/storehub', storeRouter);
app.use('/storehub', express.static('./public/StoreHub'));
app.use('/uploads', express.static('./public/uploads'));

app.get('/', (req, res) => {
  res.redirect('/public');
});

// create default Recipe in database
async function setup() {
  const defaultRecipe = await models.Recipe.findOne({
    where: {
      id: 1
    }
  });

  // check whether the default already exists
  if (!defaultRecipe) {
    const def = await models.Recipe.create({
      name: "Grilled Cheese",
      description: "A sandwich.",
      ownerid: 0,
      steps: [
        "Butter one side of each slice of bread.",
        "Place cheese slices between the unbuttered sides of the bread slices.",
        "Heat a skillet over medium heat.",
        "Place the sandwich in the skillet and cook until the bread is golden brown and the cheese is melted, flipping once.",
        "Remove from heat and serve hot."
      ],
      ingredients: [
        { amount: "2 slices", ingredient_id: "cheese" },
        { amount: "2 slices", ingredient_id: "bread" },
        { amount: "1 tablespoon", ingredient_id: "butter" }
      ],
      image: "/uploads/grilled-cheese.jpg"
    });
  }
}

sequelize.sync({ force: false }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then(()=> console.log("Setup complete"));
});

app.listen(port, () => {
  console.log(`App available at http://localhost:${port}`);
});
