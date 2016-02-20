'use strict';
var activities  = activities || {};
var models      = models || {};
var views       = views || {};
activities.message = {
  model                   : models.message,
  summary_view_dashboard  : views.dashboard_message,
  detailled_view          : views.detailled_message
};
