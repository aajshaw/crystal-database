"use strict"

const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  });

  // 'class' level functions
  User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(4), null);
  };

  // 'instance' level functions
  User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
