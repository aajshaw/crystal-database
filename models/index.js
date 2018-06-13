'use strict';

const config = require('../config/config')
const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const env       = config.get('env') || 'development';
const dbConfig  = require(__dirname + '/../config/db.json')[env];
const db        = {};

if (dbConfig.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], dbConfig);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, dbConfig);
}

fs
  // Get a list of all .js files (except basename) as models
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  // for all models make an entry in the database
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

// set up all of the associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
