'use strict';
var activities  = activities || {};
var models      = models || {};
var views       = views || {};
activities.weight_act = {
  model                   : models.body,
  new_view                : views.new_2,
  summary_view_dashboard  : views.dashboard_summary_2,
  summary_view_sessions   : views.dashboard_summary_2,
  detailled_view          : views.detailled_2
};
