var SDCard = function(){
  
  function search() {
    var sdcard = navigator.getDeviceStorage("sdcard");

    var path = "/sdcard/rbh/import";
    console.log("path", path);
    var cursor = sdcard.enumerate("/sdcard/rbh");

    cursor.onsuccess = function () {

      if (this.result) {
        var file = this.result;
        console.log("File updated on: " + file.lastModifiedDate);

        // Once we found a file we check if there are other results
        // Then we move to the next result, which calls the cursor
        // success possibly with the next file as result.
        this.continue();
      }
    }
    cursor.onerror = function(error) {
      console.log("search error", error) ;
    }
  }

  return {
    search: search
  }
}();
