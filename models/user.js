"use strict"

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  });

  return User;
};
