const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

const _data = { foo1: 'bar3' };

const createToken = (data, exp = Math.floor(Date.now() / 1000) + 30) => {
  const token = jwt.sign({ ...data, exp }, envVars.SECRET);
  const refreshToken = jwt.sign({ token }, envVars.SECRET);
  console.log({ token });
  return [token, refreshToken];
};

const response = ({ res, err, decoded, token, refreshToken }) => {
  console.log({ err, decoded });
  res.json({ err, decoded, token, refreshToken });
};

const envVars = process.env;
const app = express();

app.use(express.json());
dotenv.config({ path: path.join(__dirname, '../.env') });

let [token, refreshToken] = createToken(_data);

app.get('/', (_, res) => res.send('Hello World'));

app.post('/token-test', (req, res) => {
  jwt.verify(req.body.token, envVars.SECRET, (err, decoded) => {
    response({ res, err, decoded, token, refreshToken });
  });
});

app.post('/refresh-test', (req, res) => {
  jwt.verify(req.body.token, envVars.SECRET, (err, decoded) => {
    if (!err && decoded.token === token) {
      [token, refreshToken] = createToken(_data);
    }
    response({ res, err, decoded, token, refreshToken });
  });
});

app.listen(envVars.PORT, () => console.log(`App Listning on port: ${envVars.PORT}`));
