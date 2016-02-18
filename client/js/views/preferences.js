/* jshint browser: true */
/* globals Backbone, Preferences */
/* exported PreferencesView */
'use strict';

var PreferencesView = Backbone.NativeView.extend({
  el: '#preferences-view',

  events: {
/*    'change #language'            : 'preferenceChanged',
    'change #unit'                : 'preferenceChanged',
    'change #gender'              : 'preferenceChanged',
    'change #birthyear'           : 'preferenceChanged',
    'change #height'              : 'preferenceChanged',
    'change #weight'              : 'preferenceChanged',*/
    'click #save-preferences-btn' : 'preferencesChanged'
  },

  dom: {
    language_select   : document.getElementById('language'),
    unit_select       : document.getElementById('unit'),
    gender_select     : document.getElementById('gender'),
    birthyear_select  : document.getElementById('birthyear'),
    height_input      : document.getElementById('height'),
    weight_input      : document.getElementById('weight'),
    save_btn          : document.getElementById('save-preferences-btn')
  },

  initialize: function() {
    // console.log('PreferencesView initialize');
    // console.log('PreferencesView this.model', this.model);
    this.model = Preferences;
    // this.model.fetch();
    this.render();
    // this.listenTo('change', this.render);
  },

  preferenceChanged: function(el) {
    var preference  = el.target;
    if (preference.nodeName === 'SELECT') {
      this.model.set(preference.id, preference[preference.selectedIndex].value);
    } else if (preference.nodeName === 'INPUT') {
      this.model.set(preference.id, parseFloat(preference.value, 10));
    }
    document.webL10n.setLanguage(preference.value);
    this.model.save();
  },

  preferencesChanged: function() {
    // console.log('preferences changed');
    this.model.set({
      'language'  : this.dom.language_select[this.dom.language_select.selectedIndex].value,
      'unit'      : this.dom.unit_select[this.dom.unit_select.selectedIndex].value,
      'gender'    : this.dom.gender_select[this.dom.gender_select.selectedIndex].value,
      'birthyear' : parseInt(this.dom.birthyear_select[this.dom.birthyear_select.selectedIndex].value, 10),
      'height'    : parseInt(this.dom.height_input.value, 10),
      'weight'    : parseFloat(this.dom.weight_input.value, 2)
    });
    this.model.save();
  },

  render: function() {
    this.dom.language_select.value = this.model.get('language');
    this.dom.unit_select.value = this.model.get('unit');
    this.dom.gender_select.value = this.model.get('gender');
    this.dom.birthyear_select.value = this.model.get('birthyear');
    this.dom.height_input.value = this.model.get('height');
    this.dom.weight_input.value = this.model.get('weight');
    // console.log('PreferencesView render');
  }
});
