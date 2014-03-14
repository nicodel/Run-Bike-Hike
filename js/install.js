// install.js
var Install = function() {
  
  var manifest_url = "http://nicodel.github.com/Run-Bike-Hike/manifest.webapp";
  
  function __install(ev) {
    ev.preventDefault();
    var installApp = navigator.mozApps.install(manifest_url);

    installApp.onsuccess = function(data) {};

    installApp.onfailure = function(error) {
      alert(installApp.error.name);
    };
  }
  
  var button = document.getElementById("install");
  
  var installCheck = navigator.mozApps.checkInstalled(manifest_url);
  
  installCheck.onsuccess = function() {
    if(installCheck.result) {
      button.style.display = "non";
    } else {
      button.addEventListener("click", __install, false);
    }
  };
  
  return {
    
  };
}();