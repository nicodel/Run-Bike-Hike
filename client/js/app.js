/* jshint browser: true */
/* globals Backbone, Router */
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  console.log('launching');
  new Router();
  Backbone.history.start();
}, false);
