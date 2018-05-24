'use strict'

const express = require('express');
const app = express();

const port = process.env.PORT || 8082

const passport = require('passport');
const flash = require('connect-flash');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const config = require('./config/config');
//const db = require('./db/db')();
const db = require('./models');
//console.dir(db.User);

require('./config/passport')(passport, db.User); // pass passport for configuration

// Set up express application
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Set up passport
app.use(session({
  secret: config.get('session_secret'),
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport, db);

db.sequelize.sync().then(function () {
  // let user = db.User.build({username: "aajs", password: "xyzzy"});
  // user.save().then(() => {
  //   db.User.findAll().then(users => {
  //     console.log("Got users: " + users.length);
  //   });
  // })
  // .catch(function(err) {
  //   console.log(err.errors);
  //   throw err;
  // });
 app.listen(port);
 console.log("Listening on port " + port);
});
