// install.js
var Install = function() {
  console.log("install api");
  var manifest_url = "http://nicodel.github.io/Run-Bike-Hike/manifest.webapp";
  
  function __install(ev) {
    console.log("installing !");
    ev.preventDefault();
    var installApp = navigator.mozApps.install("http://nicodel.github.io/Run-Bike-Hike/manifest.webapp");

    installApp.onsuccess = function(data) {};

    installApp.onfailure = function(error) {
      alert(installApp.error.name);
    };
  }
  
  var button = document.getElementById("install");
  var installCheck = navigator.mozApps.checkInstalled("http://nicodel.github.io/Run-Bike-Hike/manifest.webapp");
  installCheck.onsuccess = function() {
    console.log("checking app installation");
    if(installCheck.result) {
      console.log("already installed");
      button.style.display = "non";
    } else {
      console.log("not installed");
      button.addEventListener("click", __install, false);
    }
  };
}();
