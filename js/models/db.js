define(["controller"], function(Controller){
  window.indexedDB = window.shimIndexedDB  && window.shimIndexedDB.__useShim();

  var DB_NAME = "RBH";
  var DB_VERSION = 1; // Use a long long for this value (don't use a float)
  var DB_STORE_TRACKS = "tracks";
  var DB_STORE_SETTINGS = "settings";

  var DB = {};

  // function init() {
  //   // DB.reset_app(DB_NAME);
  //   var req = window.indexedDB.open("RunBikeHike", 1);
  //   req.onsuccess = function(e) {
  //       console.log("DB created successfully: ", req.result);
  //       db = req.result;
  //       db.onabort = function(e) {
  //         db.close();
  //         db = null;
  //       };
  //     };
  //   req.onerror = function(e) {
  //     //~ DB.reset_app(DB_NAME);
  //     console.error("error on openDb: ", e.target.error.name);
  //     g_error = true;
  //     // ui.show_home_error("DB: " + e.target.error.name);
  //     console.log("DB: " + e.target.error.name);
  //   };
  //   req.onupgradeneeded = function(event) {
  //     var store = req.result.createObjectStore("tracks", {keyPath:"id", autoIncrement: true});
  //     store.createIndex("trackid", "trackid", {unique: true});
  //   };
  // }

  function initiate(successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      // DB.reset_app(DB_NAME);
      var req = window.indexedDB.open("RunBikeHike", 1);
      req.onsuccess = function(e) {
        successCallback(req.result);
        console.log("DB created successfully: ", req.result);
        db = req.result;
        db.onabort = function(e) {
          db.close();
          db = null;
        };
      };
      req.onerror = function(e) {
        //~ DB.reset_app(DB_NAME);
        console.error("error on initiate DB: ", e.target.error.name);
        errorCallback(e.target.error.name);
        g_error = true;
      };
      req.onupgradeneeded = function(event) {
        var store = req.result.createObjectStore("tracks", {keyPath:"id", autoIncrement: true});
        store.createIndex("trackid", "trackid", {unique: true});
      };
    } else  {
      errorCallback("initiate successCallback should be a function");
    }
  }

  function addTrack(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {

      var tx = db.transaction("tracks", "readwrite");
      tx.oncomplete = function(e) {
        console.log("add_track transaction completed !");
      };
      tx.onerror = function(e) {
        console.error("add_track transaction error: ", tx.error.name);
        errorCallback(x.error.name);
      };
      var store = tx.objectStore("tracks");
      var req = store.add(inTrack);
      req.onsuccess = function(e) {
        console.log("track_add store store.add successful");
        successCallback();
        // ??? going back to home ???
        // ui.back_home();
      };
      req.onerror = function(e) {
        console.error("track_add store store.add error: ", req.error.name);
        errorCallback(req.error.name);
      };
    } else  {
      errorCallback("addTrack successCallback should be a function");
    }
  }


  return {
    initiate: initiate,
    addTrack: addTrack
  };
});