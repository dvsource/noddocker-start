const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('User', { username: String, password: String, email: String });

const router = express.Router();

const getPasswordHash = (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .exec()
    .then(async (user) => {
      if (await comparePassword(password, user.password)) {
        req.session.isAuth = true;
        res.send('Login Success');
      } else {
        req.session.isAuth = false;
        res.send('Login Failed');
      }
    })
    .catch(() => res.send('User cannot found'));
});

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const passwordHash = await getPasswordHash(password);
  const user = new User({ username, password: passwordHash, email });
  user
    .save()
    .then(() => res.send('saved'))
    .catch(() => res.send('failed'));
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.send('Logout');
  });
});

module.exports = router;
