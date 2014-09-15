var testStorage = function() {

  document.querySelector("#add_a_file").addEventListener ("click", function () {
    Log("button clicked");
    addFile();

  });

  var Log = function(m) {
    var l = document.getElementById('log').innerHTML;
    document.getElementById('log').innerHTML = l + "<br />" +m;
  }

  var addFile = function() {
    var sdcard = navigator.getDeviceStorage("sdcard");
    var blob = new Blob (["this is a new file."], {"type":"plain/text"});
    
    var req = sdcard.addNamed(blob, "/sdcard/rbh/newfile.txt");

    req.onsuccess = function() {
      Log("success on saving file ", this.result);
    };

    req.onerror = function() {
      Log("Error:", this.error.name);
    };
  }
}();
