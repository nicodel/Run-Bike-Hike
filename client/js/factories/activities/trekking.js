'use strict';
var activities  = activities || {};
var models      = models || {};
var views       = views || {};
activities.trekking = {
  model                   : models.mountaineering,
  new_view                : views.new_1,
  summary_view_dashboard  : views.dashboard_summary_1,
  summary_view_sessions   : views.sessions_summary_1,
  detailled_view          : views.detailled_1
};
