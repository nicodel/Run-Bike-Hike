var importView = function() {

  function addFile(inFile) {
    
    var s = document.getElementById("select-file");

    console.log("adding file to DOM", inFile);
    
    var o = document.createElement("option");
    o.value = inFile.name;
    o.innerHTML = inFile.name;
    s.appendChild(o);
  }
  return {
    addFile: addFile
  }
}();
