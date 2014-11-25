var importView = function() {

  function addFile(inFile) {
    
    var s = document.getElementById("select-file");

    console.log("adding file to DOM", inFile.name.match(/[-_\w]+[.][\w]+$/i)[0]);
    
    var o = document.createElement("option");
    o.value = inFile.name;
    o.innerHTML = inFile.name.match(/[-_\w]+[.][\w]+$/i)[0];
    s.appendChild(o);
  }
  function resetList() {
    var sel = document.getElementById("select-file");
    var nb = sel.length;
    if (nb > 1) {
      for (var i = 0; i < nb; i++) {
        sel.remove(1);
      };
    };
  }

  return {
    addFile: addFile,
    resetList: resetList
  }
}();
