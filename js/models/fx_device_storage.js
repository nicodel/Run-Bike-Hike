/* jshint browser: true, devel: true, strict: true */
/* exported FxDeviceStorage */

var FxDeviceStorage = function() {
  "use strict";
  var user_storage = navigator.getDeviceStorage("sdcard");

  function getAvailableStorages() {
    var storages = navigator.getDeviceStorages("sdcard");
    var available_storages = [];
    storages.forEach(function(sto) {
      available_storages.push(sto.storageName);
    });
    return available_storages;
  }
  
  function getSdcard() {
    return navigator.getDeviceStorage("sdcard");
  }

  /* replace sdcard.js search() */
  function getFilesFromPath(inPath, inType, successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      var files = [];
      var req = user_storage.enumerate(inPath);
      req.onsuccess = function() {
        if(this.result) {
          var file = this.result;
          var type = "." + inType;
          if (file.name.match(/\.[0-9a-z]+$/i).toString() === type) {
            console.log("just got file:", file);
            files.push(file);
          }
          this.continue();
        }
      };
      req.onerror = function(e) {
        errorCallback(e.error.name);
        // if (e.target.error.name === "NotFoundError") {
          // errorCallback(_("import-missing"));
        // }
      };
      successCallback(files);
    } else {
      errorCallback("searchForFile() successCallback should be a function");
    }
  }

  /* replace sdcard.js get() */
  function openFile(inPath, successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      var req = user_storage.get(inPath.name);

      req.onsuccess = function () {
        var file = this.result;
        successCallback(file);
      };

      req.onerror = function () {
        // errorCallback(_("unable-get-file", {file:inPath, error:this.error}));
        errorCallback(inPath, this.error);
      };
    } else  {
      errorCallback("openFile() successCallback should be a function");
    }
  }

  /* replace share.js toLocal() */
  function saveFile(inFile, inName, successCallback, errorCallback) {
    var blob = new Blob ([inFile], {"type":"plain/text"});

    var path = "/" + user_storage.storageName + "/rbh/" + inName;
    var req = user_storage.addNamed(blob, path);

    req.onsuccess = function() {
      // successCallback(_('track-share-local-success'), this.result);
      successCallback(this.result);
    };

    req.onerror = function() {
      errorCallback(this.error.name);
      // if (this.error.name === "NoModificationAllowedError") {
        // errorCallback(_('track-share-local-failure') + " " + _('track-share-local-failure-exist'));
      // } else if (this.error.name === "SecurityError") {
        // errorCallback(_('track-share-local-failure') + " " + _('track-share-local-failure-security'));
      // } else {
        // errorCallback(_('track-share-local-failure') + " " + this.error.name);
      // }
    };
  }

  function setUserStorage(inStorage) {
    user_storage = navigator.getDeviceStorages("sdcard")[inStorage];
  }

  return {
    getAvailableStorages: getAvailableStorages,
    getSdcard:            getSdcard,
    getFilesFromPath:     getFilesFromPath,
    openFile:             openFile,
    saveFile:             saveFile,
    setUserStorage:       setUserStorage
  };

}();
