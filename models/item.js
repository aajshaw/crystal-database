"use strict"

module.exports = (sequelize, DataTypes) => {
  var Item = sequelize.define('Item', {
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.DECIMAL },
    value_approximate: { type: DataTypes.STRING }, // can be 'Y', 'N' or null if no value given
    photo_filename: { type: DataTypes.STRING },
  });

  return Item;
};
