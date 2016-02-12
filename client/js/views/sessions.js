/* jshint browser: true */
/* global Backbone, Factory, Docs */
/* exported SessionsView */
'use strict';

var SessionsView = Backbone.NativeView.extend({
  el: '#sessions-list',

  events: {
    'click .session-summary-click'  : 'sessionSelected'
  },

  sessions: [],
  viewsList: [],
  sortAscending: false,
  sortAttribute: 'date',

  initialize: function() {
    this.collection = Docs;
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.collection, 'reset', this.render);

    var that = this;
    document.getElementById('sessions-sort-attribute').addEventListener('change', function(ev) {
      that.sortAttribute = ev.target.value;
      that.sortCollection();
    });
    document.getElementById('sessions-sort-ascending').addEventListener('change', function(ev) {
      that.sortAscending = ev.target.value;
      that.sortCollection();
    });
  },

  sortCollection: function() {
    var that = this;
    this.collection.comparator = function(doc) {
      var activity = doc.get('activity');
      var timestamp = doc.get('date');

      if (!that.sortAscending) {
        if (that.sortAttribute === 'date') {
          return that.negateString(timestamp);
        }
        if (that.sortAttribute === 'activity') {
          return that.negateString(that.negateString(activity) + "-" + that.negateString(timestamp));
        }
      } else {
        if (that.sortAttribute === 'date') {
          return timestamp;
        }
        if (that.sortAttribute === 'activity') {
          return that.negateString(activity) + "-" + timestamp;
        }
      }
    };
    this.collection.sort();
    this.render();
  },

  negateString: function(s) {
    s = s.toLowerCase();
    s = s.split('');
    s = s.map(function(letter) {
      return String.fromCharCode(-(letter.charCodeAt(0)));
    });
    return s.join('');
  },


  renderItem: function(item) {
    item.set('session_cid', item.cid);
    var view = Factory.getSessionsSummaryView(item);
    this.listenTo(item, 'sessions-item-selected', this.sessionSelected);
    this.el.appendChild(view.render().el);
    this.viewsList.push(view);
  },

  render: function() {
    if (this.el.innerHTML !== '') {
      this.viewsList.forEach(function(view) {
        view.remove();
      });
      this.viewsList = [];
    }
    var sessions = this.collection.where({type: 'session'});
    sessions.forEach(function(item) {
      this.renderItem(item);
    }, this);
  },

  sessionSelected: function(session) {
    var session_cid = session.target.getAttribute('session_id');
    console.log('click sessions', session_cid);
    this.viewsList.forEach(function(view) {
      console.log('view', view.model.cid);
      if (view.model.cid === session_cid) {
        this.collection.trigger('sessions-entry-selected', view.model);
      }
    }, this);
  }
});
