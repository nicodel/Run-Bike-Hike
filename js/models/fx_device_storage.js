/* jshint browser: true, devel: true, strict: true */
/* exported FxDeviceStorage */
/* global _ */

var FxDeviceStorage = function() {
  "use strict";

  var compatible = true;
  if (typeof navigator.getDeviceStorage === 'function') {
    var user_storage = (navigator.getDeviceStorage("sdcard") || false);
    var storage_id = 0;
    var storage_name = user_storage.storageName;
    var available_storages = [];
  } else {
    compatible = false;
  }

  /**
   * Get the list of device available storages
   *
   * @return [{"id": storage id, "name": storage name}, {"id": storage id, "name": storage name}]
   */
  function getAvailableStorages() {
    var storages = navigator.getDeviceStorages("sdcard");
    for (var i = 0; i < storages.length; i++) {
      var name = storages[i].storageName;
      if(storages[i].default) {
        name = name + " " +  _("storage-default");
      }
      available_storages.push({"id": i, "name": name});
    }
    return available_storages;
  }

  function getDefault() {
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
          if (!this.done) {
            this.continue();
          }
        }
        if (this.done) {
          successCallback(files);
        }
      };
      req.onerror = function(e) {
        errorCallback(e.target.error.name);
        // if (e.target.error.name === "NotFoundError") {
          // errorCallback(_("import-missing"));
        // }
      };
    } else {
      errorCallback("searchForFile() successCallback should be a function");
    }
  }

  /* replace sdcard.js get() */
  function openFile(inPath, successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      if (compatible) {
        var req = user_storage.get(inPath);
        req.onsuccess = function () {
          var file = this.result;
          var reader = new FileReader();
          reader.onloadend = function() {
            var p = new DOMParser();
            successCallback(p.parseFromString(reader.result, "text/xml"));
          };
          reader.onerror = function(e) {
            errorCallback(_("error-reading-file",
                {
                  file: file.match(/[^/]+$/i)[0],
                  error: e.target.result
                }));
          };
          reader.readAsText(file);
          // successCallback(file);
        };
        req.onerror = function () {
          // errorCallback(_("unable-get-file", {file:inPath, error:this.error}));
          errorCallback(inPath, this.error);
        };
      } else {
        console.log('selected file', inPath);
        var file = inPath[0];
        var reader = new FileReader();
        reader.onloadend = function() {
          var p = new DOMParser();
          successCallback(p.parseFromString(reader.result, "text/xml"));
        };
        reader.onerror = function(e) {
          errorCallback(_("error-reading-file",
              {
                file: file.match(/[^/]+$/i)[0],
                error: e.target.result
              }));
        };
        reader.readAsText(file);
      }
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
      console.log('success', this.result);
      successCallback(this.result);
    };

    req.onerror = function() {
      console.log('error', this.error.name);
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
    storage_id = inStorage;
    storage_name = available_storages[storage_id].name;
  }

  /**
   * Get the ID and Name of Storage chosen by user
   * @return {id, name}
   */
  function getUserStorage() {
    return {"id": storage_id, "name": storage_name};
  }

  return {
    compatible:           compatible,
    getAvailableStorages: getAvailableStorages,
    getDefault:           getDefault,
    getFilesFromPath:     getFilesFromPath,
    openFile:             openFile,
    saveFile:             saveFile,
    setUserStorage:       setUserStorage,
    getUserStorage:       getUserStorage
  };

}();
