'use strict'

//const User = require('./models/user');

const LocalStrategy = require('passport-local').Strategy;

// expose this function to app using module exports
module.exports = function(passport, User) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  });
  // used to deserialize user
  passport.deserializeUser(function(id, done) {
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
    User.findById(id).then(user => {
      if (user) {
        done(null, user);
      } else {
        done("User not found", null);
      }
    });
  });

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    process.nextTick(function() {
      // Find a user whose username is the same as the username passed in
      User.findOne({ where: { username: username }}).then(user => {
        if (user) {
          // Name already in use
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {
          // Create the new user
          let newUser = User.build();
          newUser.username = username;
          newUser.password = User.generateHash(password);
          newUser.save().then(function (user) {
            return done(null, user);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({ where: { username: username}}).then(user => {
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'No user found'));
      }
      if (!user.validatePassword(password)) {
        return done(null, false, req.flash('loginMessage', "Wrong password"));
      }
      return done(null, user);
    });
  }));
}
