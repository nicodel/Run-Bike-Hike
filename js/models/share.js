var Share = function() {
  function toLocal(inFile, inName, successCallback, errorCallback) {

    var sdcard = navigator.getDeviceStorage("sdcard");

    // var blob = new Blob([inFile], {"type" : "text/plain"});
    var now = new Date();
    var dateStr = now.toString();
    var blob = new Blob([dateStr + '\n'], {type: 'text/plain'});

    // var name = "/sdcard/rbh/" + inName;
    var name = "/sdcard/text.txt";

    var request = sdcard.addNamed(blob, name);

    request.onsuccess = function () {
      var name = this.result;
      var message = 'File "' + name + '" successfully wrote on the sdcard storage area';
      console.log(message);
      successCallback(message);
    }

    // An error typically occur if a file with the same name already exist
    request.onerror = function () {
      if (this.error.name === "NoModificationAllowedError") {
        console.warn('Unable to write the file: ', 'File already exists');
        errorCallback('Unable to write the file: ' + 'File already exists');
      } else if (this.error.name === "SecurityError") {
        console.warn('Unable to write the file: ', 'Permission Denied');
        errorCallback('Unable to write the file: ' + 'Permission Denied');
      } else {
        console.warn('Unable to write the file: ', this.error.name);
        errorCallback('Unable to write the file: ' + this.error.name);
      };
    }
    // if (window.navigator.userAgent.startsWith("Mozilla/5.0 (Mobile")) {
      // FxOS 1.3
      // var sdcard = navigator.getDeviceStorage("sdcard");
      // var request = sdcard.addNamed(blob, "rbh/"+inName);
      // request.onsuccess = function () {
      //   var inNamee = this.result;
      //   console.log('File "' + name + '" successfully wrote on the sdcard storage area');
      // }

      // An error typically occur if a file with the same name already exist
      // request.onerror = function () {
      //   console.warn('Unable to write the file: ', this.error);
      // }

    // } else{
    //   var a = document.createElement('a');
    //   a.download = inName;
    //   a.href = window.URL.createObjectURL(blob);
    //   a.textContent = "Save exported track.";
    //   a.dispatchEvent(
    //     new window.MouseEvent('click',
    //       { 'view': window, 'bubbles': true, 'cancelable': true }
    //     )
    //   );
    // };

  }


  function AddFile() {}
  AddFile.prototype = {
    request: function addFile_request() {
      this.name = 'test-' + 'this.filename' + '.txt';
      // if (this.storageName != '') {
        this.name = '/' + 'sdcard' + '/' + this.name;
      // }
      var now = new Date();
      this.dateStr = now.toString();
      var blob = new Blob([this.dateStr + '\n'], {type: 'text/plain'});
      //log("Adding file '" + this.name + "' with contents '" +
      //    this.dateStr + "'");
      return this.storage.addNamed(blob, this.name);
    },
    onsuccess: function addFile_success(e) {
      //log("Added file '" + this.name + "' with contents '" +
      //    this.dateStr + "'");
      console.log("Added file '" + this.name + "' e.target.result = '" +
          e.target.result + "'");
    },
    onerror: function addFile_onerror(e) {
      console.log("Add file '" + this.name + "' failed");
      console.log('Reason: ' + e.target.error.name + ' (or ' +
          translateError(e.target.error.name) + ')');
    }
  };

  function toEmail(inTrack) {
    
  }

  function toTwitter() {}



  return {
    AddFile: AddFile,
    toLocal: toLocal,
    toEmail: toEmail,
    toTwitter: toTwitter
  }
}();
