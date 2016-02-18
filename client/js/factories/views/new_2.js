/* jshint browser: true */
/* globals _, Backbone, microtemplate, utils */
'use strict';

var views = views || {};

views.new_2 = Backbone.NativeView.extend({
  template: microtemplate(document.getElementById('new-session-template-2').innerHTML),

  validated: {
    'date'  : false,
    'value' : false
  },

  events: {
    'onsubmit #body-form'     : function() {return false;},
    'change #new-body-date'   : '__validateDate',
    'change #new-body-value'  : '__validateValue',
  },

  initialize: function() {
    this.listenTo(this.model, 'all', function(a, b) {console.log('something on this.model', a, b);});
  },
  render: function() {
    this.el.innerHTML = this.template({
      'lb_date'   : _('date-format'),
      'date'      : utils.Helpers.formatDate(this.model.get('date')),
      'lb_weight' : _('weight'),
      'value'     : this.model.get('value'),
    });
    // console.log('new view rendered');
    return this;
  },

  __validateDate: function() {
    var date = utils.Helpers.checkDate(document.getElementById('new-body-date').value);
    if (date[0]) {
      this.validated.date = true;
      this.trigger('enable-add');
      var d = date[1];
      this.model.set('date', new Date(d[2], d[1] - 1, d[0]).toISOString());
      // this.model.set('date', date[1]);
    } else {
      this.validated.date = false;
      this.trigger('disable-add');
    }
  },

  __validateValue: function() {
    var v = parseFloat(document.getElementById('new-body-value').value);
    // console.log('validate value', v);
    if (Number.isNaN(v)) {
      this.validated.value = false;
      this.trigger('disable-add');
    } else {
      this.validated.value = true;
      this.trigger('enable-add');
      this.model.set('value', v);
    }
  }
});
