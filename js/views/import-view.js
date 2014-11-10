var importView = function() {

  function addFile(inFile) {
    
    var s = document.getElementById("select-file");

    console.log("adding file to DOM", inFile.name.match(/[-_\w]+[.][\w]+$/i)[0]);
    
    var o = document.createElement("option");
    o.value = inFile.name;
    o.innerHTML = inFile.name.match(/[-_\w]+[.][\w]+$/i)[0];
    s.appendChild(o);
  }
  return {
    addFile: addFile
  }
}();
