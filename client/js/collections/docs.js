/* globals Backbone, Doc */
/* exported Docs */
'use strict';

var DocsCollection = Backbone.Collection.extend({
  model: Doc,

  url: '/docs',

  initialize: function() {
    console.log('DocsCollection initialize');
    // this.listenTo(this, 'all', this.something);
  },
  something: function(ev, res) {
    console.log('Something on DocsCollection', ev, res);
  }
});
var Docs = new DocsCollection();
