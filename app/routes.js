'use strict'

const config = require('../config/config');
const path = require('path');
const moment = require('moment');
const unf = require('unique-file-name').sync;
const fileNamer = unf({format: '%100b_%10r%8e', dir: config.get('photosPath')});

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

  app.post('/add', isLoggedIn, function(req, res) {
    if (req.body.description.length > 0) {
      let newItem = db.Item.build();
      newItem.name = req.body.description;
      if (req.body.value.length > 0) {
        newItem.value = req.body.value;
        if (req.body.value_approximate == "on") {
          newItem.value_approximate = "Y";
        } else {
          newItem.value_approximate = "N";
        }
      }
      if (req.files.item_photo != undefined) {
        let photo = req.files.item_photo;
        let full = fileNamer(photo.name);
        newItem.photo_filename = path.basename(full);
        photo.mv(full);
      }
      newItem.save().then(function (user) {
        res.render('pages/add', {navigation: 'add', message: req.body.description + " added"});
      });
    } else {
      res.render('pages/add', {navigation: 'add', message: 'No description given' });
    }
  });

  app.get('/list', isLoggedIn, function(req, res) {
    db.Item.findAll({order: ['name']}).then(function (items) {
      res.render('pages/list.ejs', { navigation: 'list', items: items, photoPath: config.get('photosPath') });
    });
  });

  app.get('/update/:id', isLoggedIn, function(req, res) {
    req.params['id']
  });

  app.get('/delete/:id', isLoggedIn, function(req, res) {
    db.Item.findById(req.params['id']).then(function (item) {
      if (item.photo_filename != null) {
        // remove the photo file
      }
      item.destroy().then(function () {
        db.Item.findAll({order: ['name']}).then(function (items) {
          res.render('pages/list.ejs', { navigation: 'list', items: items, photoPath: config.get('photosPath') });
        });
      });
    });
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
