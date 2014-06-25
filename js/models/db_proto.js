"use strict;"
var DATABASE = function() {
  
  var DB_NAME,        // database name
      DB_VERSION,     // database intial version
      STORE_NAME,     // 
      STORE_KEYPATH,
      STORE_ID,
      STORE_INDEX,
      STORE_STRUCT;

  function initiate(successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      var req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = function(e) {
        successCallback(req.result);
        db = req.result;
        db.onabort = function(e) {
          db.close();
          db = null;
        };
      };
      req.onerror = function(e) {
        errorCallback(e.target.error.name);
        g_error = true;
      };
      req.onupgradeneeded = function(event) {
        var store = req.result.createObjectStore(STORE_NAME, {keyPath:STORE_KEYPATH, autoIncrement: true});
        store.createIndex("trackid", "trackid", {unique: true});
      };
    } else  {
      errorCallback("initiate() successCallback should be a function");
    }
  }

  function addStore() {}
  function del() {}
  function getAll() {}
  function reset() {}

  return {
    initiate: initiate,
    addStore: addStore,
    getAll: getAll,
    del: del,
    reset: reset,
    DB_NAME: DB_NAME
  }
}();