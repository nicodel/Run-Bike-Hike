/* jshint browser: true */
/* globals
 Backbone, Factory, IndicatorsView, DashboardView, PreferencesView,
 SessionsView, ReportsView, NewSession, Preferences, Doc, Docs
*/
/* exported MainView */
'use strict';

var MainView = Backbone.NativeView.extend({
  el: '#app',

  events: {
    'click #new-session-btn'        : 'showNewSession',
    'click #dashboard-btn'          : 'showDashboard',
    'click #sessions-btn'           : 'showSessions',
    'click #reports-btn'            : 'showReports',
    'click #preferences-btn'        : 'showPreferences',

    // 'click .session-summary-click'  : 'showSession'
  },

  dom: {
    dashboard_view    : document.getElementById('dashboard-view'),
    session_view      : document.getElementById('session-view'),
    new_session_view  : document.getElementById('new-session-view'),
    sessions_view     : document.getElementById('sessions-view'),
    reports_view      : document.getElementById('reports-view'),
    preference_view   : document.getElementById('preferences-view')
  },

  PrefModel: '',
  DocsCollec: '',
  detailled_view: '',

  initialize: function() {
    // console.log('MainView initialize', this);
    Preferences.fetch();

    this.active_section = this.dom.dashboard_view;
    this.showDashboard();

    // this.listenTo(PreferencesModel, 'all', this.somethingOnPreferences);
    // this.listenTo(SessionsCollection, 'all', this.somethingOnSessions);

    Docs.fetch();

    new IndicatorsView();
    new DashboardView();
    new SessionsView();
    new ReportsView();

    this.listenTo(Docs, 'dashboard-entry-selected', this.showEntry);
    this.listenTo(Docs, 'sessions-entry-selected', this.showSession);
    this.listenTo(Docs, 'add-new', this.showSession);
  },
  somethingOnPreferences: function(ev, res) {
    console.log('got something on Preferences', ev, res);
  },
  somethingOnSessions: function(ev, res) {
    console.log('got something on Sessions', ev, res);
  },

  showNewSession: function() {
    // var model = app.SessionsCollection.create({});
    // console.log('showNewSession');
    new NewSession({
      model: new Doc()
    });
    this._viewSection(this.dom.new_session_view);
  },

  showDashboard: function() {
    this._viewSection(this.dom.dashboard_view);
  },

  showSessions: function() {
    this._viewSection(this.dom.sessions_view);
  },

  showEntry: function(model) {
    console.log('MAIN - dashboard entry selected', model);
    var type = model.get('type');
    if (type === 'session') {
      this.showSession(model);
    } else if(type === 'body'){
      this.detailled_view = Factory.getDetailledView(model);
      this._viewSection(this.domsession_view);
    } else {
      console.log('other types of dashbord entries are not managed');
    }
  },

  showSession: function(model) {
    console.log('MAIN - will display model', model);
    var that = this;
    model.fetch({
      success : function(mod, res) {
        console.log('that.detailled_view', that.detailled_view);
        if (that.detailled_view !== '') {
          that.detailled_view.remove();
        }
        that.detailled_view = Factory.getDetailledView(mod);
        that._viewSection(that.dom.session_view);
      },
      error   : function(model, response) {
        console.log('error', model, response);
      }
    });
  },

  showReports: function() {
    this._viewSection(this.dom.reports_view);
  },

  showPreferences: function() {
    new PreferencesView({
      model: Preferences
    });
    this._viewSection(this.dom.preference_view);
  },

  _viewSection: function(section) {
    if (section !== this.active_section) {
      this.active_section.setAttribute('disabled', 'true');
      section.setAttribute('disabled', 'false');
      this.active_section = section;
    }
  },

  sessionAdded: function(session) {
    // console.log('sessionAdded', session);
    // console.log('app.SessionsCollection', app.SessionsCollection);
    // Render newly added session to its view
    var view = new SessionsView({
      model: session
    });
    this.dom.sessions_view.appendChild(view.render().el);

    // Display Sessionssection
    this.showSessions();
  },

});
