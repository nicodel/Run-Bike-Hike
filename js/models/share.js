var Share = function() {
  function toLocal(inFile, inName) {
    var blob = new Blob([inFile], {"type" : "text\/xml"});
    if (window.navigator.userAgent.startsWith("Mozilla/5.0 (Mobile")) {
      // FxOS 1.3
      // var sdcard = navigator.getDeviceStorage("sdcard");
      // var request = sdcard.addNamed(blob, "rbh/"+inName);
      // request.onsuccess = function () {
      //   var name = this.result;
      //   console.log('File "' + name + '" successfully wrote on the sdcard storage area');
      // }

      // An error typically occur if a file with the same name already exist
      // request.onerror = function () {
      //   console.warn('Unable to write the file: ', this.error);
      // }
      console.log("FxOS");
      var activity = new MozActivity({
        name: "share",
        data: {
          type: "text/xml"
        }
      });

      activity.onsuccess = function() {
        console.log("Activity successfuly handled");

        // var imgSrc = this.result.blob;
      }

      activity.onerror = function() {
        console.log("The activity encouter en error: ", this.error);
      }





    } else{
      var a = document.createElement('a');
      a.download = inName;
      a.href = window.URL.createObjectURL(blob);
      a.textContent = "Save exported track.";
      a.dispatchEvent(
        new window.MouseEvent('click',
          { 'view': window, 'bubbles': true, 'cancelable': true }
        )
      );
    };
  }

  function toEmail() {}

  function toTwitter() {}

  return {
    toLocal: toLocal,
    toEmail: toEmail,
    toTwitter: toTwitter
  }
}();