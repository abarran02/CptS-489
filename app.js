const express = require('express');
const models = require('./models/models');
const sequelize = require('./db');
const session = require('express-session');
const cookieParser = require('cookie-parser');

let apiRouter = require('./routes/api');
let authRouter = require('./routes/auth');
let publicRouter = require('./routes/public');
let storeRouter = require('./routes/storehub');

const app = express();
const port = 3000;

app.set('trust proxy', 1); // trust first proxy
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
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use('/api', apiRouter);
app.use('/auth', authRouter);
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

  if (!defaultRecipe) {
    require('./database/generate');
  }
}

sequelize.sync({ force: false }).then(()=>{
  console.log("Sequelize Sync Completed...");
  setup().then(()=> console.log("Setup complete"));
});

app.listen(port, () => {
  console.log(`App available at http://localhost:${port}`);
});

module.exports = app;