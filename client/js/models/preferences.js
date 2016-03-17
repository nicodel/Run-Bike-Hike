/* globals Backbone */
/* exported Preferences */
'use strict';

var preferencesmodel = Backbone.Model.extend({

  urlRoot: '/preferences',

  idAttribute: '_id',

  initialize: function() {
    // console.log('PreferencesModel initialize', this);
  }
});
var Preferences = new preferencesmodel({parse: true});
