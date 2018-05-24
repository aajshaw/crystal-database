'use strict'

const moment = require('moment');

module.exports = function(app, passport, db) {
  // HOME PAGE (with login links)
  app.get('/', function(req, res) {
    console.log("index");
    // db.User.count(function(userCount) {
    //   if (userCount < 2) {
    //     res.render('pages/index.ejs');
    //   } else {
    //     res.render('pages/login.ejs', { message: req.flash('loginMessage'), showSignup: false });
    //   }
    // })
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
    db.User.count(function(userCount) {
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
    db.User.count(function(userCount) {
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
    req.logout();
    res.redirect('/');
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
