const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

dotenv.config({ path: path.join(__dirname, '../.env') });

app.get('/', (_, res) => res.send('Hello World'));

const envVars = process.env;

app.listen(envVars.PORT, () => console.log(`App Listning on port: ${envVars.PORT}`));
