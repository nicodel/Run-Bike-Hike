/* globals Backbone */
/* exported Doc */
'use strict';

var Doc = Backbone.Model.extend({
  idAttribute: '_id',

  defaults: {
    data: []
  },

  initialize: function() {
    // console.log('DocModel initialize', this);
    // this.listenTo(this, 'all', this.something);
  },

  something: function(ev, res) {
    console.log('Something on DocModel', ev, res);
  }
});
