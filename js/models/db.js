"use strict;"
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
            console.log("no config found, loading the default one !")
            settings = DEFAULT_CONFIG;
            __saveDefaultConfig();
          };
          var prettySettings = {};
          for (var i = 0; i < settings.length; i++) {
            prettySettings[settings[i].key] = settings[i].value;
          };
          console.log("loaded settings are:", prettySettings);
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
      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      var store = tx.objectStore(DB_STORE_TRACKS);
      var req = store.get(inTrack.id);
      req.onsuccess = function(e) {
        var req2 = store.put(inTrack);
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
    console.log("saving default config");
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

  function updateConfig(successCallback, errorCallback, inKey, inValue) {
    if (typeof successCallback === "function") {
      var tx = db.transaction(DB_STORE_SETTINGS, "readwrite");
      var store = tx.objectStore(DB_STORE_SETTINGS);
      var req = store.get(inKey);
      console.log("req", req);
      req.onsuccess = function(e) {
        req.result.value = inValue;
        console.log("req.result", req.result);
        var req2 = store.put(req.result);
        console.log("req2", req2);
        req2.onsuccess = function(e) {
          successCallback("successfully updated");
        }
        req2.onerror = function(e) {
          errorCallback(e.error.name);
        }
      }
      req.onerror = function(e) {
        errorCallback(e.error.name);
      }
    } else  {
      errorCallback("updateConfig successCallback should be a function");
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