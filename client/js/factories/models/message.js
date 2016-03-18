'use strict';

var models = models || {};

models.message = function(options) {
  this.type       = options.type      || 'message';
  this.activity   = options.activity  || 'message';
  this.date       = options.date      || new Date().toISOString();
  this.text       = options.text      || '';
};
