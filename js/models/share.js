/* jshint browser: true, strict: true, devel: true */
/* exported Share */
/* global MozActivity */

var Share = function() {
  "use strict";

  function toApps(inTrack, inFile, successCallback, errorCallback) {
    console.log("social apps share");
    var name = inTrack.name;
    // var body = "I have completed a track! o/";
    var url = "mailto:?subject=Track: " + name;
    // url += "&body=" + body;
    // var blob = new Blob([inFile], {type: "application/gpx+xml"});
    var activity = new MozActivity({
      name: "share",
      data: {
        type:"image/*",
        url: url,
        // number: 1,
        filenames: [/*name, */name + ".jpg"],
        blobs: [/*blob, */inTrack.map]
      }
    });

    activity.onsuccess = function() {
      // console.log("share success", this);
      successCallback();
    };
    activity.onerror = function() {
      console.log("share error", this.error);
      if (this.error.name === 'NO_PROVIDER') {
        console.log("share-activity-noprovider");
        errorCallback("share-activity-noprovider");
      } else {
        console.log("share-activity-error", this.error.name);
        errorCallback("share-activity-error", this.error.name);

      }
    };
  }


  return {
    // toLocal: toLocal,
/*    toEmail: toEmail,*/
    toApps: toApps
  };
}();
