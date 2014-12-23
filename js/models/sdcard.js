/* jshint browser: true, strict: true, devel: true */
/* exported SDCard */
/* global _ */
var SDCard = function(){
  "use strict";

  var storages = navigator.getDeviceStorages("sdcard");
  var sdcard = navigator.getDeviceStorage("sdcard");

  function search(inStorage, successCallback, errorCallback) {
   if (typeof(successCallback) === "function") {

    sdcard = navigator.getDeviceStorages("sdcard")[inStorage];
    var path = "rbh/import";
    console.log("path:", path);
    var cursor = sdcard.enumerate(path);

    cursor.onsuccess = function () {

      if (this.result) {
        var file = this.result;
        // console.log("File updated on:" + file.name.match(/\.[0-9a-z]+$/i));

        if (file.name.match(/\.[0-9a-z]+$/i).toString() === ".gpx") {
          console.log("just got file:", file);
          successCallback(file);
        }
        this.continue();
      }
    };
    cursor.onerror = function(error) {
      var e = error.target.error.name;
      console.log("search error", e);
      if (e === "NotFoudError") {
        errorCallback(_("import-missing"));
      }
    };
    } else  {
      errorCallback("initiate() successCallback should be a function");
    }

 }


  function get(inPath, successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      console.log("inPath", inPath);
      var req = sdcard.get(inPath.name);

      req.onsuccess = function () {
        var file = this.result;
        console.log("Get the file: " + file.name);
        successCallback(file);
      };

      req.onerror = function () {
        console.log("Unable to get the file: " + this.error);
        errorCallback(_("unable-get-file", {file:inPath, error:this.error}));
      };
    } else  {
      errorCallback("initiate() successCallback should be a function");
    }
  }

  function getStorages() {return storages;}

  function getSDCard() {return sdcard;}

  return {
    search: search,
    get: get,
    getStorages: getStorages,
    getSDCard: getSDCard
  };
}();
