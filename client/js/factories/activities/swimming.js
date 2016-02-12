'use strict';
var activities  = activities || {};
var models      = models || {};
var views       = views || {};
activities.swimming = {
  model                   : models.swimming,
  new_view                : views.new_3,
  summary_view_dashboard  : views.dashboard_summary_1,
  summary_view_sessions   : views.sessions_summary_1,
  detailled_view          : views.detailled_3
};
