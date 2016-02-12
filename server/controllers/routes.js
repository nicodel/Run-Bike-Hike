/* jshint strict: true, node: true */
'use strict';

var docs = require('./docs');
var preferences = require('./preferences');

module.exports = {
  'docs': {
    get: docs.getAll,
    post: docs.add,
  },
  'docs/:id': {
    get: docs.getOne,
    put: docs.add
  },
  'preferences': {
    get: preferences.getAll,
    post: preferences.update,
    put: preferences.update
  },
  'preferences/:id': {
    get: preferences.getAll,
    put: preferences.update
  }
};
