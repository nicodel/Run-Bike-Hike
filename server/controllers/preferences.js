/* jshint strict: true, node: true */
'use strict';
var Preferences = require('../models/preferences');

module.exports.getAll = function(req, res, next) {
  Preferences.all(function(err, data) {
    if (err !== null) {
      next(null);
    } else {

      var preferences = {};
      // console.log('preferences data', data[0]);
      if (data.length !== 0) {
        preferences = data[0];
        res.send(preferences);
      } else {
        preferences = {
          language  : 'en',
          unit      : 'metric',
          gender    : 'male',
          birthyear : 1970,
          height    : 180,
          weight    : 75
        };
        Preferences.add(preferences, function(err, doc) {
          if (err !== null) {
            res.status(500).send({error: 'An error occured - ' + err + doc});
          } else {
            res.send(preferences);
          }
        });
      }
    }
  });
};
module.exports.update = function(req, res, next) {
  var data = {
    id        : req.body.id,
    language  : req.body.language,
    unit      : req.body.unit,
    gender    : req.body.gender,
    birthyear : req.body.birthyear,
    height    : req.body.height,
    weight    : req.body.weight
  };
  Preferences.update(data, function(err, prefs) {
    if (err !== null) {
      res.status(500).send({error: 'An error occured - ' + err + prefs});
      next(null);
    } else {
      // console.log('Preferences updated', prefs);
      res.send();
    }
  });
};
