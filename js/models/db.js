// define(["controller"], function(Controller){
var DB = function() {
  window.indexedDB = window.shimIndexedDB  && window.shimIndexedDB.__useShim();

  var DB_NAME = "RunBikeHike";
  var DB_VERSION = 1; // Use a long long for this value (don't use a float)
  var DB_STORE_TRACKS = "tracks";
  var DB_STORE_SETTINGS = "settings";

  var DEFAULT_CONFIG = [
    {"key":"screen", "value":false},
    {"key":"language", "value":"en"},
    {"key":"distance", "value":"0"},
    {"key":"speed", "value":"0"},
    {"key":"position", "value":"0"}
  ];
/*  var DEFAULT_CONFIG = {
    screen : false,
    language : "en",
    distance : 0,
    speed : 0,
    position : 0
  };*/

  function initiate(successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      // DB.reset_app(DB_NAME);
      var req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = function(e) {
        // console.log("DB created successfully: ", req.result);
        db = req.result;
        successCallback(req.result);
        db.onabort = function(e) {
          db.close();
          db = null;
        };
      };
      req.onerror = function(e) {
        console.error("error on initiate DB: ", e.target.error.name);
        errorCallback(e.target.error.name);
        g_error = true;
      };
      req.onupgradeneeded = function(event) {
        //
        // Create tracks store as:
        //
        var store = req.result.createObjectStore(DB_STORE_TRACKS, {keyPath:"id", autoIncrement: true});
        store.createIndex("trackid", "trackid", {unique: true});

        //
        // Create settings store as:
        //
        var store = req.result.createObjectStore(DB_STORE_SETTINGS, {keyPath: "key"});
        store.createIndex("key", "key", {unique: true});
        store.createIndex("value", "value", {unique: false});
/*        var store = req.result.createObjectStore(DB_STORE_SETTINGS, {keyPath:"screen"});
        store.createIndex("screen", "screen", {unique: true});
        store.createIndex("language", "language", {unique: true});
        store.createIndex("distance", "distance", {unique: true});
        store.createIndex("speed", "speed", {unique: true});
        store.createIndex("position", "position", {unique: true});*/
      };
    } else  {
      errorCallback("initiate() successCallback should be a function");
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
        errorCallback(e.error.name);
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
        console.log("get_tracks store.openCursor successful !", cursor);
        if (cursor) {
          // console.log("cursor.value", cursor.value);
          all_tracks.push(cursor.value);
          // ui.build_track(cursor.value);
          cursor.continue();
        } else{
          // console.log("got all tracks: ", all_tracks);
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
  function deleteTrack(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {
      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      tx.oncomplete = function(e) {
        console.log("delete_track transaction completed !");
      };
      tx.onerror = function(e) {
        console.error("delete_track transaction error: ", tx.error.name);
        errorCallback(x.error.name);
      };
      var store = tx.objectStore(DB_STORE_TRACKS);
      var req = store.delete(inTrack.id);
      req.onsuccess = function(e) {
        console.log("track_delete store store.delete successful");
        successCallback(inTrack.name);
      };
      req.onerror = function(e) {
        console.error("track_delete store store.delete error: ", req.error.name);
        errorCallback(req.error.name);
      };
    } else  {
      errorCallback("deleteTrack successCallback should be a function");
    }
  }
  function getConfig(successCallback, errorCallback) {
    if (typeof successCallback === "function") {
      var settings = [];
      var tx = db.transaction(DB_STORE_SETTINGS);
      var store = tx.objectStore(DB_STORE_SETTINGS);
      var req = store.openCursor();
      req.onsuccess = function(e) {
        var cursor = e.target.result;
        if (cursor) {
          settings.push(cursor.value);
          cursor.continue();
        } else {
          if (settings.length === 0) {
            settings = DEFAULT_CONFIG;
            __saveDefaultConfig();
          };
          var prettySettings = {};
          for (var i = 0; i < settings.length; i++) {
            prettySettings[settings[i].key] = settings[i].value;
          };
          successCallback(prettySettings);
        }
      };
      req.onerror = function(e) {console.error("getConfig store.openCursor error: ", e.error.name);};
    } else {
      errorCallback("getConfig() successCallback should be a function");
    }
  }
  function saveMap(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {
      console.log("saving inTrack in DB.saveMap", inTrack);

      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      var store = tx.objectStore(DB_STORE_TRACKS);
      console.log("inTrack.id", inTrack.id);
      var req = store.get(inTrack.id);
      console.log("req", req);

      req.onsuccess = function(e) {

        console.log("retreived req.result", req.result);

        var req2 = store.put(inTrack);
        console.log("req2", req2);
        req2.oncomplete = function(e) {
          console.log("successfully updated");
        }
        req2.onerror = function(e) {
          console.log("failure on saving map");
          errorCallback(e.error.name);
        }
      }
    } else  {
      errorCallback("addTrack successCallback should be a function");
    }
  }
  function __saveDefaultConfig() {
    var tx = db.transaction(DB_STORE_SETTINGS, "readwrite");
    tx.oncomplete = function(e) {
      // console.log("successful creating default config !");
    };
    tx.onerror = function(e) {
      // console.error("default config transaction error: ", tx.error.name);
      errorCallback(x.error.name);
    };
    var store = tx.objectStore([DB_STORE_SETTINGS]);
/*    var req = store.add(DEFAULT_CONFIG);
    req.onsuccess = function(e) {
      console.log("added: ", e.target.result);
    };
    req.onerror = function(e) {
      console.error("error: ", req.error.name);
    };*/
    for (var i = 0; i < DEFAULT_CONFIG.length; i++) {
      var req = store.add(DEFAULT_CONFIG[i]);
      req.onsuccess = function(e) {
        // body...
        // console.log("added: ", e.target.result);
      };
      req.onerror = function(e) {
        // console.error("error: ", req.error.name);
      };
    };
  }

  function updateConfig(successCallback, errorCallback, inSettings) {
    // FIXME : really not pretty, but ...
    var uglySettings = [];
    uglySettings[0] = {};
    uglySettings[0].key = "screen";
    uglySettings[0].value = inSettings.screen;
    uglySettings[1] = {};
    uglySettings[1].key = "language";
    uglySettings[1].value = inSettings.language;
    uglySettings[2] = {};
    uglySettings[2].key = "distance";
    uglySettings[2].value = inSettings.distance;
    uglySettings[3] = {};
    uglySettings[3].key = "speed";
    uglySettings[3].value = inSettings.speed;
    uglySettings[4] = {};
    uglySettings[4].key = "position";
    uglySettings[4].value = inSettings.position;
    // console.log("uglySettings:", uglySettings);
    if (typeof successCallback === "function") {
      var tx = db.transaction([DB_STORE_SETTINGS], "readwrite");
      tx.oncomplete = function(e) {
        console.log("successful updating config !");
        successCallback();
      };
      tx.onerror = function(e) {
        console.error("saving config transaction error: ", tx.error.name);
        errorCallback(tx.error.name);
      };
      var store = tx.objectStore(DB_STORE_SETTINGS);
      for (var i = 0; i < uglySettings.length; i++) {
        var req = store.delete(uglySettings[i].key);
        req.onsuccess = function(e) {};
        req.onerror = function(e) {};
      };
      for (var i = 0; i < uglySettings.length; i++) {
        var req = store.add(uglySettings[i]);
        req.onsuccess = function(e) {};
        req.onerror = function(e) {};
      };
    } else {
      errorCallback("getConfig() successCallback should be a function");
    }
  }

  return {
    initiate: initiate,
    addTrack: addTrack,
    getTracks: getTracks,
    deleteTrack: deleteTrack,
    reset_app: reset_app,
    getConfig: getConfig,
    updateConfig: updateConfig,
    saveMap: saveMap
  };
}();
// });


/*

RunBikeHike
  tracks
    track_name
  
  settings = table
*/