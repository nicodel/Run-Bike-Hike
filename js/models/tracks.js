define(["controller"], function(Controller){

  var current_track;

  function open() {
    current_track = {};
    // Get start date
    current_track.date = new Date().toISOString();
    // Define track ID (= start date)
    current_track.trackid = current_track.date;
    // Build track name
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var day = new Date().getDate();
    var hour = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    current_track.name = "TR-"+year+month+day+"-"+hour+min+sec;
    // Initiate the rest
    current_track.duration = 0;
    current_track.distance = 0;
    current_track.data = [];
    // Set the number of gps point
    nb_point = 0;
  }

  function addNode(inNode) {
    current_track.data.push(inNode);
    nb_point =+ 1;
  }

  function close() {
    return current_track;
  }


  return {
    open: open,
    addNode: addNode,
    close: close
  };
});