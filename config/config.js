"use strict"

module.exports = {
  get: function(key) {
    if (key == 'session_secret') {
      return 'secret';
    } else {
      throw 'config get unknown key ' + key;
    }
  }
};
