/* jshint browser: true */
/* globals _, Backbone, microtemplate, Preferences, utils */
'use strict';

var views = views || {};

views.new_3 = Backbone.NativeView.extend({
  template: microtemplate(document.getElementById('new-session-template-3').innerHTML),

  events: {
    'change #new-session-date'          : '__validateDate',
    'change #new-session-time'          : '__validateDate',
    'change #new-session-distance'      : '__validateDistance',
    'change #new-session-duration-hour' : '__validateDuration',
    'change #new-session-duration-min'  : '__validateDuration',
    'change #new-session-duration-sec'  : '__validateDuration',
  },

  validated: {
    distance  : false,
    duration  : false,
    date      : true
  },

  initialize: function() {
  },

  render: function() {
    this.validated.distance = true;
    this.validated.duration = true;
    var pref_unit = Preferences.get('unit');
    var distance = utils.Helpers.distanceMeterToChoice(
      pref_unit,
      this.model.get('distance'),
      false
    );
    var duration = utils.Helpers.formatDuration(this.model.get('duration'));
    var speed = utils.Helpers.speedMsToChoice(pref_unit, this.model.get('avg_speed'));
    this.el.innerHTML = this.template({
      'lb_date'       : _('date-format'),
      'date'          : utils.Helpers.formatDate(this.model.get('date')),
      'lb_time'       : _('start-time-format'),
      'time'          : utils.Helpers.formatTime(this.model.get('date')),
      'lb_distance'   : _('distance-format'),
      'distance'      : distance.value,
      'distance_unit' : distance.unit,
      'lb_duration'   : _('duration-format'),
      'durationH'     : duration.hour,
      'durationM'     : duration.min,
      'durationS'     : duration.sec,
      'lb_avg_speed'  : _('average-speed'),
      'avg_speed'     : speed.value,
      'speed_unit'    : speed.unit,
      'lb_calories'   : _('calories'),
      'calories'      : this.model.get('calories')
    });
    console.log('new view rendered');
    return this;
  },

  renderCalories: function() {
    var calories = utils.Helpers.calculateCalories(
        Preferences.get('gender'),
        Preferences.get('weight'),
        Preferences.get('height'),
        new Date().getFullYear() - Preferences.get('birthyear'),
        this.model.get('distance'),
        this.model.get('duration'),
        this.model.get('activity')
    );
    document.getElementById('new-session-calories').value = calories;
    this.model.set('calories', calories);
  },

  renderAvgSpeed: function() {
    var speed = this.model.get('distance') / this.model.get('duration');
    document.getElementById('new-session-avg-speed').value = utils.Helpers.speedMsToChoice(
      Preferences.get('unit'),
      speed
    ).value;
    this.model.set('avg_speed', speed);
  },

  __validateDuration: function() {
    var h = parseInt(document.getElementById('new-session-duration-hour').value, 10);
    var m = parseInt(document.getElementById('new-session-duration-min').value, 10);
    var s = parseInt(document.getElementById('new-session-duration-sec').value, 10);
    // console.log('new duration', h, m, s);
    if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s)) {
      this.validated.duration = false;
      this.trigger('disable-add');
    } else if (h >= 0 || h <= 24 && m >= 0 || m <= 60 && s >= 0 || s <= 60) {
      // console.log('new duration', h * 3600 + m * 60 + s);
      this.model.set(
        'duration',
        h * 3600 + m * 60 + s
      );
      this.validated.duration = true;
      this.trigger('enable-add');
      if (this.validated.distance) {
        this.renderCalories();
        this.renderAvgSpeed();
      }
    } else {
      this.validated.duration = false;
      this.trigger('disable-add');
    }
  },

  __validateDate: function() {
    var date = utils.Helpers.checkDate(document.getElementById('new-session-date').value);
    var time = utils.Helpers.checkTime(document.getElementById('new-session-time').value);
    if (date[0] && time[0]) {
      this.validated.date = true;
      this.trigger('enable-add');
      var d = date[1];
      var t = time[1];
      this.model.set('date', new Date(d[2], d[1] - 1, d[0], t[0], t[1],t[2]));

    } else {
      this.validated.date = false;
      this.trigger('disable-add');
    }
    // console.log('validate date', this.validated.date);
  },

  __validateDistance: function() {
    var d = parseFloat(document.getElementById('new-session-distance').value);
    if (Number.isNaN(d)) {
      this.validated.distance = false;
      this.trigger('disable-add');
    } else {
      this.model.set(
        'distance',
        utils.Helpers.distanceChoiceToMeter(
          Preferences.get('unit'),
          d
        )
      );
      this.validated.distance = true;
      this.trigger('enable-add');
      if (this.validated.duration) {
        this.renderCalories();
        this.renderAvgSpeed();
      }
    }
  }
});
