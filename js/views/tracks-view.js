var TracksView = function() {

  function display(inTracks) {
    __remove_childs("tracks-list");
  
    var tracks = [];
    tracks = inTracks;
    for (var i = tracks.length - 1; i >= 0; i--) {
      __buildList(tracks[i]);
    }
  }

  function __buildList(inTrack) {

    var li = document.createElement("li");
    var lia = document.createElement("a");
    lia.className = "it-track";
    //~ lia.href = "#";

    var div = '<p><span class="align-left">' + inTrack.name + '</span>';
    div = div + '<span class="align-right">' + Config.userDate(inTrack.date) + '</span></p>';
    div = div + '<p class="new-line"><span class="align-left">' + Config.userDistance(inTrack.distance) + '</span>';
    var d = inTrack.duration / 60000;
    div = div + '<span class="align-right">' + d.toFixed(0) + 'min</span></p>';
    lia.innerHTML = div;
    li.appendChild(lia);
    document.getElementById("tracks-list").appendChild(li);
    lia.addEventListener("click", function(e){
      document.querySelector("#trackView").className = "current";
      document.querySelector("#tracksView").className = "left";
      // ui.display_track(inTrack);
      Controller.displayTrack(inTrack);
    });
  }

  function __remove_childs(parent) {
    var d = document.getElementById(parent).childNodes;
    console.log("d",d);
    for (i = 0; i < d.length; i++) {
      document.getElementById(parent).removeChild(d[i]);
    }
  }

  return {
    display: display
  };

}();