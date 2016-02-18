/* jshint browser: true */
/* globals _, Backbone, Preferences, utils */
/* exported Tracking */
'use strict';

var Tracking = Backbone.NativeView.extend({
  el: '#tracking-view',

  events: {
    'click #btn-start-stop' : 'toggleTracking'
  },

  watchID       : '',
  tracking      : false,
  current_track : '',
  nb_point      : '',
  distance      : '',
  duration      : '',

  initialize: function() {
    console.log('initiate tracking');
    if(navigator.geolocation) {
      var that = this;
      this.watchID = navigator.geolocation.watchPosition(
        function(position) {
          that.locationChanged(position);
        },
        function(error) {
          that.locationError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximunAge: 0
        }
      );
    } else {
      console.log('your browser does not support geolocation');
    }
  },

  toggleTracking: function() {
    if (this.tracking) {
      // Pause tracking and show recording view
    } else {
      this.tracking = true;
      // Start the calculation of elapsed time
      utils.Chrono.load(document.getElementById('home-chrono'));
      utils.Chrono.start();
      // Open new track
      this.current_track = utils.Tracks.open();
      this.nb_point = 0;
      document.getElementById('btn-start-stop').className = 'danger big';
      document.getElementById('btn-start-stop').textContent = _('stop');
      document.getElementById('btn-pause').className='recommend small icon icon-pause';
    }
  },

  locationChanged: function(inPosition){
    // console.log("Position found", inPosition);
    if (inPosition.coords.accuracy < 50) {
      if (this.tracking && !this.pause) {
        // console.log("tracking");
        this.addNewPoint(inPosition);
      } else if (this.tracking && this.pause) {
        this.updateInfos(inPosition, this.distance);
      } else {
        // console.log("not tracking");
        this.updateInfos(inPosition, null);
      }
    } else {
        this.displayAccuracy(inPosition);
    }
  },

  locationError: function(inError){
    console.log("error:",inError);
    if (this.tracking) {
      this.positionError(inError);
    } else {
      this.displayError(inError);
    }
  },

  addNewPoint: function(inPosition){
    if (!inPosition.coords || !inPosition.coords.latitude || !inPosition.coords.longitude) {
      return;
    }
    var event = inPosition.coords;
    // Display GPS data, log to Db
    var speed = event.speed;
    var lat = event.latitude.toFixed(6);
    var lon = event.longitude.toFixed(6);
    var alt = event.altitude;
    var date = new Date(inPosition.timestamp).toISOString();
    var horizAccuracy = event.accuracy.toFixed(0);
    var vertAccuracy = event.altitudeAccuracy.toFixed(0);

    // fix bad values from gps
    if (alt < -200 || (alt === 0 && vertAccuracy === 0)) {
      alt = null;
    }
    // calculate distance
    this.distance = utils.Tracks.getDistance(lat, lon);

    // calculating duration
    this.duration = utils.Tracks.getDuration(inPosition.timestamp);

    this.updateInfos(inPosition, this.distance);

    // appending gps point
    var gps_point = {
      latitude:lat,
      longitude:lon,
      altitude:alt,
      date:date,
      speed:speed,
      accuracy:horizAccuracy,
      vertAccuracy:vertAccuracy
    };
    utils.Tracks.addNode(gps_point, this.distance, this.duration);
  },
  positionError: function() {},

  updateInfos: function(inPosition, inDistance){
    var pref_unit = Preferences.get('unit');
    var localizedValue = {};
    document.getElementById("message").className = "behind hidden";
    // display latitude using Settings format
    document.getElementById("home-lat").innerHTML = utils.Helpers.formatLatitude(inPosition.coords.latitude);
    // display longitude using Settings format
    document.getElementById("home-lon").innerHTML = utils.Helpers.formatLongitude(inPosition.coords.longitude);
    // display altitude using Settings format
    localizedValue = utils.Helpers.formatSmallDistance(
      pref_unit,
      inPosition.coords.altitude,
      false
    );
    document.getElementById("home-alt").innerHTML = localizedValue.value;
    document.getElementById("alt-unit").innerHTML = "(" + localizedValue.unit + ")";

    // display accuracy using settings unit
    localizedValue = utils.Helpers.formatSmallDistance(
      pref_unit,
      inPosition.coords.accuracy.toFixed(0),
      false
      );
    document.getElementById("home-acc").innerHTML = "&#177; " + localizedValue.value;
    document.getElementById("acc-unit").innerHTML =  "(" + localizedValue.unit + ")";
    // checking accuracy and display appropriate GPS status
    if (inPosition.coords.accuracy > 25) {
      document.getElementById("home-acc").className = "new-line home-alt align-center text-big text-thinner bad-signal";
    } else {
      document.getElementById("home-acc").className = "new-line home-alt align-center text-big text-thin";
    }
    // updating distance using Settings choosen unit
    localizedValue = utils.Helpers.formatDistance(
      pref_unit,
      inDistance,
      false
    );
    document.getElementById("home-dist").innerHTML = localizedValue.value;
    document.getElementById("dist-unit").innerHTML = "(" + localizedValue.unit + ")";
    // updating speed using Settings choosen unit
    localizedValue = utils.Helpers.formatSpeed(pref_unit, inPosition.coords.speed);
    document.getElementById("home-speed").innerHTML = localizedValue.value;
    document.getElementById("speed-unit").innerHTML = "(" + localizedValue.unit + ")";
    // empty message area
    document.getElementById('msg').innerHTML = "";
    if (inPosition.coords.heading > 0 ) {
      document.getElementById('home-dir').innerHTML = inPosition.coords.heading.toFixed(0);
    } else {
      document.getElementById('home-dir').innerHTML = "--";
    }
  },

  displayAccuracy: function(inPosition) {
    var a = utils.Helpers.formatSmallDistance(
      Preferences.get('unit'),
      inPosition.coords.accuracy.toFixed(0),
      false
    );
    document.getElementById("accmsg").innerHTML = _("accmsg", {Accuracy: a.value, Unit: a.unit});
    document.getElementById("accmsg").className = "text-big align-center";
  }


});
