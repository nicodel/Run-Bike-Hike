var SDCard = function(){

  function search(successCallback, errorCallback) {
    var sdcard = navigator.getDeviceStorage("sdcard");
    // var files = [];

    var cursor = sdcard.enumerate("rbh/import");

    cursor.onsuccess = function () {

      if (this.result) {
        var file = this.result;
        console.log("File updated on:" + file.name.match(/\.[0-9a-z]+$/i));

        if (file.name.match(/\.[0-9a-z]+$/i) == ".gpx") {
          successCallback(file);
        }
        this.continue();
      }
    }
    cursor.onerror = function(error) {
      var e = error.target.error.name
      console.log("search error", e);
      if (e === "NotFoudError") {
        errorCallback(_("import-missing"));
      }
    }
  }
  return {
    search: search
  }
}();