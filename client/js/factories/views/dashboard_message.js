/* jshint browser: true */
/* globals Backbone, microtemplate, Preferences, utils */
'use strict';

var views = views || {};

views.dashboard_message = Backbone.NativeView.extend({
  tagName: 'li',

  template: microtemplate(document.getElementById('dashboard_message').innerHTML),

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(Preferences, 'change', this.render);
  },

  extend: Backbone.Events,

  render: function() {
    // console.log('DASHBOARD MESSAGE - this.model', this.model);
    this.el.innerHTML = this.template({
      'session_cid' : this.model.get('session_cid'),
      'date'        : utils.Helpers.formatDate(this.model.get('date')),
      'text'        : this.model.get('text')
    });
    return this;
  }
});
