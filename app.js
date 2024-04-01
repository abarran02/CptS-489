const express = require('express');
const path = require('path');
const sequelize = require('./db');
const Recipe = require('./models/Recipe');

var apiRouter = require('./routes/api');

const app = express();
const port = 3000;

app.use(express.static('Public'));
app.use(express.urlencoded({extended: false}));
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

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
})