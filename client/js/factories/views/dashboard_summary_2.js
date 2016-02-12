/* jshint browser: true */
/* globals Backbone, microtemplate, Preferences, utils */
'use strict';

var views = views || {};

views.dashboard_summary_2 = Backbone.NativeView.extend({
  tagName: 'li',

  template: microtemplate(document.getElementById('session-summary-template-2').innerHTML),

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(Preferences, 'change', this.render);
  },

  extend: Backbone.Events,

  render: function() {
    console.log('MODEL', this.model);
    this.el.innerHTML = this.template({
      'session_cid' : this.model.cid,
      'date'        : utils.Helpers.formatDate(this.model.get('date')),
      'value'       : this.model.get('value'),
      'activity'    : this.model.get('activity')
    });
    return this;
  }
});
