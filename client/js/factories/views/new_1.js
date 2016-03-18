/* jshint browser: true */
/* globals _, Backbone, microtemplate, Preferences, utils */
'use strict';

var views = views || {};

views.new_1 = Backbone.NativeView.extend({
  template: microtemplate(document.getElementById('new-session-template-1').innerHTML),

  events: {
    'change #import-file'   : 'enableImport',
    'click #import-btn'     : 'importFile',
    // 'onsubmit #import-form' : function() {return false;},
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
    this.listenTo(this.model, 'import', this.renderImportedData);
    this.listenTo(this.model, 'change:map', this.renderMap);
    // this.listenTo(this.model, 'all', function(a, b) {console.log('something on this.model', a, b);});
  },

  importFile: function() {
    var reader = new FileReader();
    var that = this;
    reader.onloadend = function() {
      var p = new DOMParser();
      utils.GPX.importFile(p.parseFromString(reader.result, 'text/xml'), function(result) {
        if (result.error) {
          // TODO create a modal view for error or information display
          console.log('error while importing', result.res);
        } else {
          var calories = utils.Helpers.calculateCalories(
              Preferences.get('gender'),
              Preferences.get('weight'),
              Preferences.get('height'),
              new Date().getFullYear() - Preferences.get('birthyear'),
              result.res.distance,
              result.res.duration,
              that.model.get('activity')
          );
          result.res.calories = calories;
          that.model.set(result.res);
          that.model.trigger('import');
          console.log('new session imported', that.model.attributes);
        }
      });
    };
    reader.readAsText(document.getElementById('import-file').files[0]);
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
      'lb_import_file': _('import-gpx-file'),
      'lb_import'     : _('import'),
      'lb_date'       : _('date-format'),
      'date'          : utils.Helpers.formatDate(this.model.get('date')),
      'lb_time'       : _('start-time-format'),
      'time'          : utils.Helpers.formatTime(this.model.get('date')),
      'lb_distance'   : _('distance-format'),
      'distance_unit' : distance.unit,
      'distance'      : distance.value,
      'lb_duration'   : _('duration-format'),
      'durationH'     : duration.hour,
      'durationM'     : duration.min,
      'durationS'     : duration.sec,
      'lb_alt_max'    : _('altitude-max'),
      'alt_max'       : this.model.get('alt_max'),
      'lb_alt_min'    : _('altitude-min'),
      'alt_min'       : this.model.get('alt_min'),
      'alt_unit'      : 'm',
      'lb_avg_speed'  : _('average-speed'),
      'avg_speed'     : speed.value,
      'speed_unit'    : speed.unit,
      'lb_calories'   : _('calories'),
      'calories'      : this.model.get('calories'),
      'lb_map'        : _('map')
    });
    // console.log('new view rendered');
    return this;
  },

  renderImportedData: function() {
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
    document.getElementById('new-session-date').value = utils.Helpers.formatDate(this.model.get('date'));
    document.getElementById('new-session-time').value = utils.Helpers.formatTime(this.model.get('date'));
    document.getElementById('new-session-distance').value = distance.value;
    // document.getElementById('new-session-distance-unit').innerHTML = distance.unit;
    document.getElementById('new-session-duration-hour').value = duration.hour;
    document.getElementById('new-session-duration-min').value = duration.min;
    document.getElementById('new-session-duration-sec').value = duration.sec;
    document.getElementById('new-session-alt-max').value = this.model.get('alt_max');
    document.getElementById('new-session-alt-min').value = this.model.get('alt_min');
    // document.getElementById('new-session-alt-unit-max').innerHTML = 'm';
    // document.getElementById('new-session-alt-unit-min').innerHTML = 'm';
    document.getElementById('new-session-avg-speed').value = speed.value;
    // document.getElementById('new-session-speed-unit').innerHTML = speed.unit;
    document.getElementById('new-session-calories').value =  this.model.get('calories');
  },

  enableImport: function() {
    var file_list = document.getElementById('import-file').files;
    if (file_list.length > 0) {
      document.getElementById('import-btn').removeAttribute('disabled');
    } else {
      document.getElementById('import-btn').setAttribute('disabled', 'disabled');
    }
  },

  renderMap: function() {
    var map = this.model.get('map');
    if (map !== false) {
      // console.log('rendering map', this.model.attributes);
      utils.Map.initialize('new-map');
      utils.Map.getMap(this.model.get('data'));
      document.getElementById('new-map-container').className = 'new-line';
    }
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
      console.log('sending enable-add', this.validated);
      this.trigger('enable-add');
      if (this.validated.distance) {
        this.renderCalories();
        this.renderAvgSpeed();
      }
    } else {
      this.validated.duration = false;
      console.log('sending disable-add', this.validated);
      this.trigger('disable-add');
    }
  },

  __validateDate: function() {
    var date = utils.Helpers.checkDate(document.getElementById('new-session-date').value);
    var time = utils.Helpers.checkTime(document.getElementById('new-session-time').value);
    if (date[0] && time[0]) {
      this.validated.date = true;
      console.log('sending enable-add', this.validated);
      this.trigger('enable-add');
      var d = date[1];
      var t = time[1];
      this.model.set('date', new Date(d[2], d[1] - 1, d[0], t[0], t[1],t[2]));

    } else {
      this.validated.date = false;
      console.log('sending disable-add', this.validated);
      this.trigger('disable-add');
    }
    // console.log('validate date', this.validated.date);
  },

  __validateDistance: function() {
    var d = parseFloat(document.getElementById('new-session-distance').value);
    if (Number.isNaN(d)) {
      this.validated.distance = false;
      console.log('sending disable-add', this.validated);
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
      console.log('sending enable-add', this.validated);
      if (this.validated.duration) {
        this.renderCalories();
        this.renderAvgSpeed();
      }
    }
  }
});
