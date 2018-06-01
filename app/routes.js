'use strict'

const moment = require('moment');

module.exports = function(app, passport, db) {
  // HOME PAGE (with login links)
  app.get('/', function(req, res) {
    db.User.count().then(function (userCount) {
      if (userCount < 2) {
        res.render('pages/index.ejs');
      } else {
        res.render('pages/login.ejs', { message: req.flash('LoginMessage'), showSignup: false });
      }
    });
  });
  // LOGIN
  app.get('/login', function(req, res) {
    console.log("get login");
    db.User.count().then(function (userCount) {
    // render and pass in flash data if it exists
      res.render('pages/login.ejs', { message: req.flash('loginMessage'), showSignup: userCount < 2 });
    })
  });
  // Process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // SIGNUP
  app.get('/signup', function(req, res) {
    console.log("get signup");
    db.User.count().then(function(userCount) {
      if (userCount < 2) {
        res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
      } else {
        res.render('pages/login.ejs', { message: req.flash('loginMessage'), showSignup: false });
      }
    })
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/dashboard',
    failureRedirect : '/signup',
    failureFlash: true
  }));

  // LOGOUT
  app.get('/logout', function(req, res) {
    console.log("logout");
    req.logout();
    res.redirect('/');
  });

  app.get('/dashboard', isLoggedIn, function(req, res) {
    db.Item.count().then(function(itemCount) {
      res.render('pages/dashboard.ejs', { navigation: 'dashboard', user: req.user, itemCount: itemCount });
    });
  });

  app.get('/add', isLoggedIn, function(req, res) {
    res.render('pages/add.ejs', { navigation: 'add' });
  });

  app.get('/list', isLoggedIn, function(req, res) {
    res.render('pages/list.ejs', { navigation: 'list' });
  });
};

// route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Not authenticated, back to home page
  res.redirect  ('/');
}
