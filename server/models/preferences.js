/* jshint strict: true, node: true */
'use strict';
var cozydb = require('cozydb');
var Preferences = cozydb.getModel('preferences', {
  'language'  : String,
  'unit'      : String,
  'gender'    : String,
  'birthyear' : Number,
  'height'    : Number,
  'weight'    : Number
});
Preferences.all = function(callback) {
  Preferences.request("all", {}, function(err, docs) {
    if (err) {
      callback(err);
    } else {
      // console.log('docs', docs);
      callback(null, docs);
    }
  });
};
Preferences.add = function(data, callback) {
  Preferences.create(data, function(err, preferences) {
    if (err) {
      callback(err);
    } else {
      callback(null, preferences);
    }
  });
};
Preferences.update = function(data, callback) {
  Preferences.find(data.id, function(err, res) {
/*    console.log('res to be updated', res);
    console.log('data to update', data);*/
    res.updateAttributes(data, function(err, preferences) {
      if (err) {
        callback(err);
      } else {
        callback(null, preferences);
      }
    });
  });
};
module.exports = Preferences;
