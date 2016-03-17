/* globals _, Backbone, Doc, Factory */
/* exported Docs */
'use strict';

var DocsCollection = Backbone.Collection.extend({
  model: Doc,

  url: '/docs',

  initialize: function() {
    // console.log('DocsCollection initialize');
    // this.listenTo(this, 'all', this.something);
    this.listenTo(this, 'sync', this.synced);
  },

  synced: function(ev, res) {
    // console.log('Synced on DocsCollection', ev);
    if (ev.length === 0) {
      console.log('adding the welcome message');
      var welcome = Factory.getModel(
        'message',
        {
          'activity'  : 'message',
          'date'      : new Date().toISOString(),
          'text'      : 'Welcome to Run, Bike, Hike...'
        }
      );
      var m = this.add(welcome);
      m.save();
    }
  },

  something: function(ev, res) {
    console.log('Something on DocsCollection', ev, res);
  }
});
var Docs = new DocsCollection();
