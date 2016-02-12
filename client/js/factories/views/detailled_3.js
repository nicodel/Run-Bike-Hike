/* jshint browser: true */
/* globals Backbone, microtemplate, Preferences, utils
*/
'use strict';

var views = views || {};

views.detailled_3  = Backbone.NativeView.extend({
  el: '#session-view',

  session_id: '',

  template: microtemplate(document.getElementById('session-details-template-2').innerHTML),

  initialize: function() {
    // console.log('SessionView initialized', this);
    this.render();
  },

  render: function() {
    var user_unit = Preferences.get('unit');
    var dist = utils.Helpers.distanceMeterToChoice(
        user_unit,
        this.model.get('distance'),
        false);
    var speed = utils.Helpers.speedMsToChoice(
        user_unit,
        this.model.get('avg_speed'));
    var duration = utils.Helpers.formatDuration(this.model.get('duration'));

    this.el.innerHTML = this.template({
      'session_cid' : this.model.get('session_cid'),
      'date'        : utils.Helpers.formatDate(this.model.get('date')),
      'time'        : utils.Helpers.formatTime(this.model.get('date')),
      'calories'    : this.model.get('calories'),
      'distance'    : dist.value + ' ' + dist.unit,
      'duration'    : duration.hour + ':' + duration.min + ':' + duration.sec,
      'avg_speed'   : speed.value + ' ' + speed.unit,
      'activity'    : this.model.get('activity')
    });
  },

});
