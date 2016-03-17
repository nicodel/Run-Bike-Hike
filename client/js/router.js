/* globals Backbone, MainView */
/* exported Router */
'use strict';

var Router = Backbone.Router.extend({
  initialize: function() {
    // console.log('starting router');
  },
  routes: {
    ''  : 'main'
  },

  main: function() {
    // console.log('starting MainView');
    new MainView({});
  }
});
