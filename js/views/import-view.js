/* jshint browser: true, strict: true, devel: true */
/* exported importView */

var importView = function() {
  "use strict";

  function addFile(inFile) {
    var s = document.getElementById("select-file");
    var o = document.createElement("option");
    o.value = inFile.name;
    o.innerHTML = inFile.name.match(/[^/]+$/i)[0];
    s.appendChild(o);
  }
  function resetList() {
    var sel = document.getElementById("select-file");
    var nb = sel.length;
    if (nb > 1) {
      for (var i = 0; i < nb; i++) {
        sel.remove(1);
      }
    }
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
    addFile: addFile,
    resetList: resetList,
    showSpinner: showSpinner,
    hideSpinner: hideSpinner
  };
}();
