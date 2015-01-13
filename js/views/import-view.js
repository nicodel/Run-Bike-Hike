/* jshint browser: true, strict: true, devel: true */
/* exported importView */
/* global _ */

var importView = function() {
  "use strict";

  function updateSelectFilesList(inFiles) {
    var s = document.getElementById('select-file');
    inFiles.forEach(function(file) {
      var o = document.createElement('option');
      o.value = file.name;
      o.innerHTML = file.name.match(/[^/]+$/i)[0];
      s.appendChild(o);
    });
  }

  /**
   * update the storage name in the Import View
   * @param {string} inName
   */
  function updateStorageName(inName) {
    // console.log("inName", inName);
    var msg  = document.getElementById("import-track-path");
    msg.innerHTML = _("import-track-path", {name: _(inName)});
  }


  function resetList() {
    var sel = document.getElementById("select-file");
    sel.innerHTML = "";
    var o = document.createElement("option");
    o.value = "empty";
    o.innerHTML = "--";
    sel.appendChild(o);
  }
  function showSpinner() {
    document.getElementById("import-spinner-area").className = "align-center front";
    document.getElementById("import-form").className = "light behind";
  }
  function hideSpinner() {
   document.getElementById("import-spinner-area").className = "align-center hidden behind";
   document.getElementById("import-form").className = "light";
  }

  return {
    updateSelectFilesList:  updateSelectFilesList,
    updateStorageName:      updateStorageName,
    resetList:              resetList,
    showSpinner:            showSpinner,
    hideSpinner:            hideSpinner
  };
}();
