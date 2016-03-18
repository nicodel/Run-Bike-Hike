'use strict';

var models = models || {};

models.waterSport = function(options) {
  this.type       = options.type      || 'session';
  this.family     = options.family    || 'watersport';
  this.activity   = options.activity  || '';
  this.date       = options.date      || new Date().toISOString();
  this.name       = options.name      || '';
  this.duration   = options.duration  || 0;
  this.distance   = options.distance  || 0;
  this.avg_speed  = options.avg_speed || 0;
  this.calories   = options.calories  || 0;
  this.map        = options.map       || false;
  this.data       = options.data      || [];
};
