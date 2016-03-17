/* globals activities */
/* exported Factory */
'use strict';

var Factory = (function() {
  var getModel = function(activity, options) {
    // console.log('FACTORY - get model for', activity);
    var Model = activities[activity].model;
    return Model ? new Model(options) : null;
  };
  var getNewView = function(model) {
    // console.log('FACTORY - display new session view for', model);
    var View = activities[model.get('activity')].new_view;
    return new View({
      model: model
    });
  };
  var getDashboardSummaryView = function(model) {
    // console.log('FACTORY - display dashboard summary view for', model);
    var View = activities[model.get('activity')].summary_view_dashboard;
    return new View({
      model: model
    });
  };
  var getSessionsSummaryView = function(model) {
    var View = activities[model.get('activity')].summary_view_sessions;
    // console.log('FACTORY - display sessions summary view for', model);
    return new View({
      model: model
    });
  };
  var getDetailledView = function(model) {
    var View = activities[model.get('activity')].detailled_view;
    // var View = activities[model.activity].detailled_view;
    // console.log('FACTORY - display detailled view for', model);
    return new View({
      model: model
    });
  };
  return {
    getModel                : getModel,
    getNewView              : getNewView,
    getDashboardSummaryView : getDashboardSummaryView,
    getSessionsSummaryView  : getSessionsSummaryView,
    getDetailledView        : getDetailledView
  };
})();
