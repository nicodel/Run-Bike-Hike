/* jshint browser: true */
/* globals
 Backbone, microtemplate, Preferences, utils, d3, crossfilter, dc
*/
'use strict';

var views = views || {};

views.detailled_1 = Backbone.NativeView.extend({
  el: '#session-view',

  session_id: '',

  dom: {
    map : document.getElementById('session-map-container')
  },

  template: microtemplate(document.getElementById('session-details-template').innerHTML),

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
    var alt_max = utils.Helpers.distanceMeterToChoice(
        user_unit,
        this.model.get('alt_max'),
        false);
    var alt_min = utils.Helpers.distanceMeterToChoice(
        user_unit,
        this.model.get('alt_min'),
        false);
    var duration = utils.Helpers.formatDuration(this.model.get('duration'));

    this.el.innerHTML = this.template({
      'session_cid' : this.model.get('session_cid'),
      'date'        : utils.Helpers.formatDate(this.model.get('date')),
      'time'        : utils.Helpers.formatTime(this.model.get('date')),
      'calories'    : this.model.get('calories'),
      'distance'    : dist.value + ' ' + dist.unit,
      'duration'    : duration.hour + ':' + duration.min + ':' + duration.sec,
      'avg_speed'   : speed.value + ' ' + speed.unit,
      'alt_max'     : alt_max.value + ' ' + alt_max.unit,
      'alt_min'     : alt_min.value + ' ' + alt_min.unit,
      'activity'    : this.model.get('activity')
    });

    var data = this.model.get('data');
    if (data.length !== 0) {
      if (!!window.SharedWorker) {
        var that = this;
        var dataWorker = new SharedWorker('js/workers/data_compute.js');
        console.log('dataWorker', dataWorker);
        dataWorker.port.postMessage([data, user_unit]);
        dataWorker.port.onmessage = function(e) {
          console.log('data have been computed', e.data);
          that.renderGraphs(e.data[0], e.data[1]);
          // that.renderMap();
        };
        console.log('dataWorker.port', dataWorker.port);
      }
    }
  },

  renderMap: function() {
    var map = this.model.get('map');
    var data = this.model.get('data');
    if (map !== false) {
      utils.Map.initialize('session-map');
      utils.Map.getMap(data);
    }
  },

  renderGraphs: function(complete_data, summary_data) {
    var user_unit = Preferences.get('unit');
    var scale;
    if (user_unit === 'metric') {
      scale = 1000;
    } else {
      scale = 1609;
    }
    // TODO manage small distance unit for Imperial
    var small_unit = utils.Helpers.distanceMeterToChoice('', 0, false).unit;
    var big_unit = utils.Helpers.distanceMeterToChoice(user_unit, 0, false).unit;
    var speed_unit = utils.Helpers.speedMsToChoice(user_unit, 0).unit;

    var geo_table = dc.dataTable('#geo_table');
    var alt_graph = dc.lineChart('#alt_graph');
    var alt_table = dc.dataTable('#alt_table');
    var speed_graph = dc.lineChart('#speed_graph');
    var speed_table = dc.dataTable('#speed_table');

    var complete_ndx    = crossfilter(complete_data),
        distDim         = complete_ndx.dimension(function(d) {return d.cumulDistance / scale;}),
        distMin         = 0,
        distMax         = this.model.get('distance') / scale,
        altGroup        = distDim.group().reduceSum(function(d) {return d.altitude;}),
        speedGroup      = distDim.group().reduceSum(function(d) {
          return utils.Helpers.speedMsToChoice(user_unit, d.speed).value;
        });
    var summary_ndx     = crossfilter(summary_data),
        summary_distDim = summary_ndx.dimension(function(d) {return d.distance;});

    geo_table
      // .width(960)
      .size(summary_data.length)
      .dimension(summary_distDim)
      .group(function() {return '';})
      .columns([
        {
          label   :'Distance (' + big_unit +')',
          format  : function(d) {return parseInt(utils.Helpers.distanceMeterToChoice(user_unit, d.distance, false).value, 0);}
        },
        {
          label   : 'Duration',
          format  : function(d) {
            var duration = utils.Helpers.formatDuration(d.time);
            return duration.hour + ':' + duration.min + ':' + duration.sec;
          }
        },
        {
          label   : 'Latitude',
          format  : function(d) {return d.latitude;}
        },
        {
          label   : 'Longitude',
          format  : function(d) {return d.longitude;}
        }
      ]);
    alt_graph
      // .width(960).height(200)
      .dimension(distDim)
      .mouseZoomable(false)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .brushOn(false)
      .group(altGroup)
      .title(function(d) {
        return 'Distance: ' + d.key.toFixed(2) + ' ' + big_unit + '\n' + 'Altitude: ' + d.value + ' ' + small_unit;
      })
      .x(d3.scale.linear().domain([distMin, distMax]));
    alt_table
      // .width(960)
      .size(summary_data.length)
      .dimension(summary_distDim)
      .group(function() {return '';})
      .columns([
        {
          label   :'Distance (' + big_unit +')',
          format  : function(d) {return parseInt(utils.Helpers.distanceMeterToChoice(user_unit, d.distance, false).value, 0);}
        },
        {
          label   : 'Duration',
          format  : function(d) {
            var duration = utils.Helpers.formatDuration(d.time);
            return duration.hour + ':' + duration.min + ':' + duration.sec;
          }
        },
        {
          label   : 'Altitude (' + small_unit +')',
          format  : function(d) {return d.altitude;}
        },
        {
          label   : 'Climb (' + small_unit +')',
          format  : function(d) {return d.climb;}
        }
      ]);
    speed_graph
      // .width(960).height(200)
      .dimension(distDim)
      .mouseZoomable(false)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .brushOn(false)
      .group(speedGroup)
      .title(function(d) {
        return 'Distance: ' + d.key.toFixed(2) + ' ' + big_unit + '\n' + 'Speed: ' + d.value + ' ' + speed_unit;
      })
      .x(d3.scale.linear().domain([distMin, distMax]));
    speed_table
      // .width(960)
      .size(summary_data.length)
      .dimension(summary_distDim)
      .group(function() {return '';})
      .columns([
        {
          label   :'Distance (' + big_unit +')',
          format  : function(d) {return parseInt(utils.Helpers.distanceMeterToChoice(user_unit, d.distance, false).value, 0);}
        },
        {
          label   : 'Duration',
          format  : function(d) {
            var duration = utils.Helpers.formatDuration(d.time);
            return duration.hour + ':' + duration.min + ':' + duration.sec;
          }
        },
        {
          label   : 'Speed (' + speed_unit +')',
          format  : function(d) {return d.speed;}
        }
      ]);

    dc.renderAll();
    return this;
  }
});

