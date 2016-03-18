'use strict';

var models = models || {};

models.body = function(options) {
  this.type       = options.type      || 'mesure';
  this.family     = options.family    || 'body';
  this.activity   = options.activity  || '';
  this.date       = options.date      || new Date().toISOString();
  this.value      = options.value     || 0;
};
