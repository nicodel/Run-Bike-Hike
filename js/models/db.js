// define(["controller"], function(Controller){
var DB = function() {
  window.indexedDB = window.shimIndexedDB  && window.shimIndexedDB.__useShim();

  var DB_NAME = "RunBikeHike";
  var DB_VERSION = 1; // Use a long long for this value (don't use a float)
  var DB_STORE_TRACKS = "tracks";
  var DB_STORE_SETTINGS = "settings";

  function initiate(successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      // DB.reset_app(DB_NAME);
      var req = window.indexedDB.open(DB_NAME, DB_VERSION);
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
        var store = req.result.createObjectStore(DB_STORE_TRACKS, {keyPath:"id", autoIncrement: true});
        store.createIndex("trackid", "trackid", {unique: true});
      };
    } else  {
      errorCallback("initiate successCallback should be a function");
    }
  }

  function addTrack(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {

      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      tx.oncomplete = function(e) {
        console.log("add_track transaction completed !");
      };
      tx.onerror = function(e) {
        console.error("add_track transaction error: ", tx.error.name);
        errorCallback(x.error.name);
      };
      var store = tx.objectStore(DB_STORE_TRACKS);
      var req = store.add(inTrack);
      req.onsuccess = function(e) {
        console.log("track_add store store.add successful");
        successCallback(inTrack.name);
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

  function getTracks(successCallback, errorCallback) {
    if (typeof successCallback === "function") {
      var all_tracks = [];
      var tx = db.transaction("tracks");
      var store = tx.objectStore("tracks");
      var req = store.openCursor();
      req.onsuccess = function(e) {
        var cursor = e.target.result;
        //~ console.log("get_tracks store.openCursor successful !", cursor);
        if (cursor) {
          all_tracks.push(cursor.value);
          // ui.build_track(cursor.value);
          cursor.continue();
        } else{
          console.log("got all tracks: ", all_tracks);
          successCallback(all_tracks);
        }
      };
      req.onerror = function(e) {console.error("get_tracks store.openCursor error: ", e.error.name);};
    } else {
      errorCallback("getTracks successCallback should be a function");
    }
  }

  function reset_app() {
    var req = window.indexedDB.deleteDatabase(DB_NAME);
    req.onerror = function(e) {
      console("reset error: ", e.error.name);
    };
    req.onsuccess = function(e) {
      console.log(DB_NAME + " deleted successful !");
    };
  }

  return {
    initiate: initiate,
    addTrack: addTrack,
    getTracks: getTracks,
    reset_app: reset_app
  };
}();
// });


/*

RunBikeHike
  tracks
    track_name
  
  settings = table
*/