const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('./../models/user');

const routeAuthenticationGuard = require('./../middleware/route-authentication-guard');

const router = Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/sign-up', (req, res) => {
  res.render('authentication/sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (password.length === 0) {
    const error = new Error("Don't forget to set up a password!");
    next(error);
  } else {
    bcrypt
      .hash(password, 10)
      .then(hashAndSalt => {
        return User.create({
          username,
          passwordHashAndSalt: hashAndSalt
        });
      })
      .then(user => {
        req.session.userID = user._id;
        res.redirect('/');
      })
      .catch(error => {
        next(error);
      });
  }
});

router.get('/sign-in', (req, res) => {
  res.render('authentication/sign-in');
});

router.post('/sign-in', (req, res) => {
  const { username, password } = req.body;

  let user;

  User.findOne({ username })
    .then(document => {
      user = document;
      if (!user) {
        return Promise.reject(new Error('No user with that username.'));
      }
      const passwordHashAndSalt = user.passwordHashAndSalt;
      return bcrypt.compare(password, passwordHashAndSalt);
    })
    .then(comparison => {
      if (comparison) {
        // User username and password are correct
        req.session.userId = user._id;
        res.redirect('private');
      } else {
        // User username and password are wrong.
        const error = new Error('Password did not match.');
        return Promise.reject(error);
      }
    })
    .catch(error => {
      res.render('authentication/sign-in', { error: error });
    });
});

router.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/authentication/sign-in');
});

router.get('/private', routeAuthenticationGuard, (req, res) => {
  res.render('private');
});

router.get('/main', routeAuthenticationGuard, (req, res) => {
  res.render('main');
});

module.exports = router;
