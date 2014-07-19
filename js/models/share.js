var Share = function() {
  function toLocal(inFile, inName, successCallback, errorCallback) {
    var blob = new Blob([inFile], {"type" : "text\/xml"});
    var sdcard = navigator.getDeviceStorage("sdcard");
    var request = sdcard.addNamed(blob, "rbh/"+inName);
    request.onsuccess = function () {
      var name = this.result;
      var message = 'File "' + name + '" successfully wrote on the sdcard storage area';
      console.log(message);
      successCallback(message);
    }

    // An error typically occur if a file with the same name already exist
    request.onerror = function () {
      console.warn('Unable to write the file: ', this.error);
      errorCallback('Unable to write the file: ', this.error)
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

  function toEmail() {}

  function toTwitter() {}

  return {
    toLocal: toLocal,
    toEmail: toEmail,
    toTwitter: toTwitter
  }
}();