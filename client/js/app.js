/* jshint browser: true */
/* exported _ */
/* globals Backbone, Router */
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  // console.log("document.webL10n.getLanguage()", document.webL10n.getLanguage());
  var _ = document.webL10n.get;
  console.log('launching');
  new Router();
  Backbone.history.start();
}, false);
