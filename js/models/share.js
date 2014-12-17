/* jshint browser: true, strict: true, devel: true */
/* exported Share */
/* global _, MozActivity */

var Share = function() {
  "use strict";
  function toLocal(inFile, inName, successCallback, errorCallback) {
    console.log("saving to local :-(");
    var sdcard = navigator.getDeviceStorage("sdcard");
    var blob = new Blob ([inFile], {"type":"plain/text"});

    var req = sdcard.addNamed(blob, "/sdcard/rbh/" + inName);

    req.onsuccess = function() {
      successCallback(_('track-share-local-success'), this.result);
    };

    req.onerror = function() {
      if (this.error.name === "NoModificationAllowedError") {
        errorCallback(_('track-share-local-failure') + _('track-share-local-failure-exist'));
      } else if (this.error.name === "SecurityError") {
        errorCallback(_('track-share-local-failure') + _('track-share-local-failure-security'));
      } else {
        errorCallback(_('track-share-local-failure') + this.error.name);
      }
    };
  }

  function toEmail(inTrack, inFile) {
    var blob = new Blob([inFile], {type: "application/gpx+xml"});
    var name = inTrack.name + ".gpx";
    var subject = "Track: " + name;
    
    var activity = new MozActivity({
      name: "new",
      data: {
        type: "mail",
        url: "mailto:?subject=" + subject,
        filenames: [name, inTrack.name + ".jpg"],
        blobs: [blob, inTrack.map]
     }
    });

    activity.onsuccess = function() {
      console.log("email send with success:", this.result);
    };
    activity.onerror = function() {
      console.log("email not send:", this.error);
    };
  }

  function toTwitter() {}



  return {
    toLocal: toLocal,
    toEmail: toEmail,
    toTwitter: toTwitter
  };
}();
