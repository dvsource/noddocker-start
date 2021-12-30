const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth-routes');
const { redirect } = require('express/lib/response');

dotenv.config({ path: path.join(__dirname, '../.env') });
const envVars = process.env;

const store = new MongoDBStore({
  uri: envVars.MONGO_DB_URL,
  connectionOptions: {
    auth: {
      username: envVars.MONGO_DB_USER,
      password: envVars.MONGO_DB_PASS,
    },
  },
  databaseName: envVars.MONGO_DB_DATABASE,
  collection: envVars.MONGO_DB_COLLECTION,
});

store.on('error', function (error) {
  console.log(error);
});

const app = express();

app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, store }));

app.use((req, _, next) => {
  if (!req.session.views) {
    req.session.views = {};
  }

  // get the url pathname
  const { method } = req;
  const { pathname } = parseurl(req);

  // count the views
  const sessionViewKey = `${method}:${pathname}`;
  req.session.views[sessionViewKey] = (req.session.views[sessionViewKey] || 0) + 1;

  next();
});

app.get('/', (_, res) => res.send('Hello World'));

app.use('/auth', authRoutes);

app.use((req, res, next) => {
  console.log(req.session);
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/');
  }
});

app.get('/api', (_, res) => res.send('API Working!!!'));

mongoose
  .connect(envVars.MONGO_DB_URL, {
    auth: {
      username: envVars.MONGO_DB_USER,
      password: envVars.MONGO_DB_PASS,
    },
    dbName: envVars.MONGO_DB_DATABASE,
  })
  .then(() => app.listen(envVars.PORT, () => console.log(`App Listning on port: ${envVars.PORT}`)));
