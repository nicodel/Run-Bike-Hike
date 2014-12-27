/* jshint browser: true, devel: true, strict: true */
/* exported Storage */
/* global _ */
var Storage = function() {
  "use strict";
  var user_storage;

  function getAvailable() {
    var storages = navigator.getDeviceStorages("sdcard");
    var available_storages;
    storages.forEach(function(sto) {
      available_storages.push(sto.storageName);
    });
    return available_storages;
  }

  function searchForFiles(inPath, inType, successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      var s = navigator.getDeviceStorages("sdcard")[user_storage];
      var req = s.enumerate(inPath);
      req.onsuccess = function() {
        if(this.result) {
          var file = this.result;
          var type = "." + inType;
          if (file.name.match(/\.[0-9a-z]+$/i).toString() === type) {
            console.log("just got file:", file);
            successCallback(file);
          }
          this.continue();
        }
      };
      req.onerror = function(e) {
        if (e.target.error.name === "NotFoundError") {
          errorCallback(_("import-missing"));
        }
      };
    } else {
      errorCallback("searchForFile() successCallback should be a function");
    }
  }

  function getFile() {}

  function saveFile() {}

  function setUserStorage(inStorage) {
    user_storage = inStorage;
  }

  return {
    getAvailable:   getAvailable,
    searchForFiles: searchForFiles,
    getFile:        getFile,
    saveFile:       saveFile,
    setUserStorage: setUserStorage
  };

}();
