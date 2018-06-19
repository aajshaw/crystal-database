"use strict"

const nconf = require('nconf');

nconf.file('./config/config.json');

nconf.defaults({
  "photosPath": 'public/photos'
});

module.exports = {
  get: function(key) {
    return nconf.get(key);
  }
};
