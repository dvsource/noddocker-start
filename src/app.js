const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

dotenv.config({ path: path.join(__dirname, '../.env') });

app.get('/', (_, res) => res.send('Hello World'));

const envVars = process.env;

mongoose
  .connect(envVars.MONGODB_URL, {
      user: envVars.MONGO_INITDB_ROOT_USERNAME,
      pass: envVars.MONGO_INITDB_ROOT_PASSWORD,
      dbName: envVars.MONGO_INITDB_DATABASE
  })
  .then(() => {
      console.log(`Mongo DB Connected`);
      app.listen(envVars.PORT, () => console.log(`App Listning on port: ${envVars.PORT}`));
  });

