/* jshint browser: true */
/* globals Backbone, microtemplate, Docs, Preferences, utils */
/* exported IndicatorsView */
'use strict';

var IndicatorsView = Backbone.NativeView.extend({
  el: '#indicators',

  template: microtemplate(document.getElementById('indicators-template').innerHTML),

  initialize: function() {
/*    this.model = app.IndicatorsModel;
    this.model.fetch();
    console.log('IndicatorsView is initalize', this);*/
    this.collection = Docs;
    this.render();

    this.listenTo(this.collection, 'change', this.render);
    this.listenTo(this.collection, 'sync', this.render);

    this.listenTo(Preferences, 'change', this.render);

  },

  render: function() {
    // console.log('indicators view is rendered', this);
    var totals = {
      'sessions'  : 0,
      'calories'  : 0,
      'distance'  : 0,
      'duration'  : 0
    };
    // console.log('INDICATORS - this.collection', this.collection);
    var sessions = this.collection.where({type: 'session'});
    sessions.forEach(function(item) {
      totals.sessions += 1;
      totals.calories += parseInt(item.get('calories'), 10);
      totals.distance += parseFloat(item.get('distance'), 10);
      totals.duration += parseInt(item.get('duration'), 10);
    });
    var dist = utils.Helpers.distanceMeterToChoice(
        Preferences.get('unit'),
        totals.distance, false);
    var duration = utils.Helpers.formatDuration(totals.duration);
    this.el.innerHTML = this.template({
      'sessions'  : totals.sessions,
      'calories'  : totals.calories,
      'distance'  : dist.value + ' ' + dist.unit,
      'duration'  : duration.hour + ':' + duration.min + ':' + duration.sec
    });
    // console.log('totals', totals);
    return this;
  },
});
