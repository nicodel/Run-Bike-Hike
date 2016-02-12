/* jshint browser: true */
/* globals Backbone, microtemplate, Preferences, utils
*/
'use strict';

var views = views || {};

views.detailled_2 = Backbone.NativeView.extend({
  el: '#session-view',

  session_id: '',

  dom: {
    map : document.getElementById('session-map-container')
  },

  template: microtemplate(document.getElementById('body-details-template').innerHTML),

  initialize: function() {
    // console.log('SessionView initialized', this);
    this.render();
  },

  render: function() {
    this.el.innerHTML = this.template({
      'session_cid' : this.model.get('session_cid'),
      'date'        : utils.Helpers.formatDate(this.model.get('date')),
      'value'       : this.model.get('value'),
      'activity'    : this.model.get('activity')
    });
  }
});
