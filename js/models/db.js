define(["controller"], function(Controller){
  window.indexedDB = window.shimIndexedDB  && window.shimIndexedDB.__useShim();

  var DB_NAME = "RBH";
  var DB_VERSION = 1; // Use a long long for this value (don't use a float)
  var DB_STORE_TRACKS = "tracks";
  var DB_STORE_SETTINGS = "settings";

  var DB = {};

  function init() {
    // DB.reset_app(DB_NAME);
    var req = window.indexedDB.open("RBH", 1);
    req.onsuccess = function(e) {
        console.log("DB created successfully: ", req.result);
        db = req.result;
        db.onabort = function(e) {
          db.close();
          db = null;
        };
      };
    req.onerror = function(e) {
      //~ DB.reset_app(DB_NAME);
      console.error("error on openDb: ", e.target.error.name);
      g_error = true;
      // ui.show_home_error("DB: " + e.target.error.name);
      console.log("DB: " + e.target.error.name);
    };
    req.onupgradeneeded = function(event) {
      var store = req.result.createObjectStore("tracks", {keyPath:"id", autoIncrement: true});
      store.createIndex("trackid", "trackid", {unique: true});
    };
  }

  function addTrack() {
    var tx = db.transaction("tracks", "readwrite");
    tx.oncomplete = function(e) {console.log("add_track transaction completed !");};
    tx.onerror = function(e) {console.error("add_track transaction error: ", tx.error.name);};
    var store = tx.objectStore("tracks");
    var req = store.add(new_track);
    req.onsuccess = function(e) {
      console.log("track_add store store.add successful");
      // ??? going back to home ???
      // ui.back_home();
    };
    req.onerror = function(e) {console.error("track_add store store.add error: ", req.error.name);};
  }


  return {
    init: init,
    addTrack: addTrack
  };
});