define(function(){

  var current_track = {};
  var start_date, distance;
  var olat = null;
  var olon = null;

  function open() {
    current_track = {};
    // Get start date
    current_track.date = new Date().toISOString();
    start_date = new Date().getTime();
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

    return current_track;
  }

  function addNode(inNode) {
    current_track.data.push(inNode);
    nb_point =+ 1;
  }

  function getDistance(lat, lon) {
    if (olat != null) {      
      distance += __distanceFromPrev(olat, olon, lat, lon);
    };
    olat = lat;
    olon = lon;
    return distance;
  }

  function getDuration(time) {
    return time - start_date;
  }

  function close() {
    return current_track;
  }

  // function __distanceFromPrev(lat1, lon1, lat2, lon2) {
  var __distanceFromPrev = function(lat1, lon1, lat2, lon2) {
    var lat1Rad = lat1*( Math.PI / 180);
    var lon1Rad = lon1*( Math.PI / 180);
    var lat2Rad = lat2*( Math.PI / 180);
    var lon2Rad = lon2*( Math.PI / 180);

    var dLat = lat2Rad - lat1Rad;
    var dLon = lon2Rad - lon1Rad;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var R = 6371 * 1000;
    return R * c;
  }

  return {
    open: open,
    addNode: addNode,
    getDuration: getDuration,
    getDistance: getDistance,
    close: close
  };
});