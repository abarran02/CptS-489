const express = require('express');
const sequelize = require('./db');
const Recipe = require('./models/Recipe');

var apiRouter = require('./routes/api');
var publicRouter = require('./routes/public');
var storeRouter = require('./routes/storehub');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: false}));
app.use('/api', apiRouter);
app.use('/public', publicRouter);
app.use('/public', express.static('./public/Public'));
app.use('/storehub', storeRouter);
app.use('/storehub', express.static('./public/StoreHub'));

app.get('/', (req, res) => {
  res.redirect('/public');
});

// create default Recipe in database
async function setup() {
  const defaultRecipe = await Recipe.findOne({
    where: {
      Recipeid: 1
    }
  });

  // check whether the default already exists
  if (!defaultRecipe) {
    const def = await Recipe.create(
      {
        recipeid: "1",
        name: "Grilled Cheese",
        description: "A sandwich."
      }
    );
  }
}

sequelize.sync({ force: false }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then(()=> console.log("Setup complete"))
});

// app.post('/', async (req, res) => {
//   const postData = req.body;
//   console.log(postData);
// });

app.listen(port, () => {
  console.log(`App available at http://localhost:${port}`)
});
