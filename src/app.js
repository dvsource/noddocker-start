const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const parseurl = require('parseurl');
const dotenv = require('dotenv');
const path = require('path');

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

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, store }));

app.use((req, _, next) => {
  console.log({ session: req.session, sessionId: req.session.id });
  next();
});

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

app.get('/foo', function (req, res) {
  req.session.lastFooReq = new Date();
  res.json({
    req: parseurl(req),
    session: req.session,
    sessionId: req.session.id,
    message: `you viewed this page ${req.session.views[`${req.method}:/foo`]} times`,
  });
});

app.get('/bar', function (req, res) {
  req.session.lastBarReq = new Date();
  res.json({
    req: parseurl(req),
    session: req.session,
    sessionId: req.session.id,
    message: `you viewed this page ${req.session.views[`${req.method}:/bar`]} times`,
  });
});

app.listen(envVars.PORT, () => console.log(`App Listning on port: ${envVars.PORT}`));
