/* jshint strict: true, node: true */
'use strict';
var cozydb = require('cozydb');
var Docs = cozydb.getModel('docs', {
  'id'        : String,
  'name'      : String,
  'duration'  : String,
  'distance'  : String,
  'date'      : String,
  'avg_speed' : String,
  'calories'  : String,
  'alt_max'   : String,
  'alt_min'   : String,
  'climb_pos' : String,
  'climb_neg' : String,
  'map'       : Boolean,
  'activity'  : String,
  'type'      : String,
  'text'      : String,
  'family'    : String,
  'data'      : cozydb.NoSchema,
  'value'     : String
});
Docs.all = function(callback) {
  Docs.request("all", {}, function(err, docs) {
    if (err) {
      callback(err);
    } else {
      callback(null, docs);
    }
  });
};
Docs.add = function(data, callback) {
  console.log('data to add through model is', data);
  Docs.create(data, function(err, docs) {
    if (err) {
      callback(err);
    } else {
      console.log('docs after add are', docs);
      callback(null, docs);
    }
  });
};
module.exports = Docs;
