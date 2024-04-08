const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');

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
      image: "uploads/grilled-cheese.jpg"
    });
  }
}

sequelize.sync({ force: false }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then(()=> console.log("Setup complete"));
});

// app.post('/', async (req, res) => {
//   const postData = req.body;
//   console.log(postData);
// });

app.listen(port, () => {
  console.log(`App available at http://localhost:${port}`);
});
