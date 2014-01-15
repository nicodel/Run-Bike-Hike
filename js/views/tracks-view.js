var TracksView = function() {

  function display(inTracks) {
    // __remove_childs("tracks-list");
    var list = document.getElementById("tracks-list");
    // console.log("list.childNodes",list.childNodes);
    for (i = 0; i = list.childNodes.length - 1; i++) {
      if (list.childNodes[i]) {
        if (list.childNodes[i].className === "it-track") {
          console.log("cleaning element " + i + " " + list.childNodes[i]);
          list.removeChild(list.childNodes[i]);
        } else {
          console.log("element " + i + " " + list.childNodes[i]);
        };
      };
      // console.log("remove element " + i + " " + list.childNodes[i].textContent);
      // document.getElementById("tracks-list").removeChild(d.childNodes[i]);
    }

    if (inTracks.length === 0) {
      __showEmpty();
    } else{
      var tracks = [];
      tracks = inTracks;
      for (var i = tracks.length - 1; i >= 0; i--) {
        __buildList(tracks[i]);
      }
    };
  }

  function reset() {
    __remove_childs("tracks-list");
  }

  function __showEmpty() {
    var el = document.createElement("p");
    el.className = "empty-tracks";
    el.innerHTML = "Empty tracks list."
    document.getElementById("tracks-list").appendChild(el);
  }

  function __buildList(inTrack) {
    // console.log("__buildList - inTrack: ", inTrack);
    var li = document.createElement("li");
    li.className = "it-track";
    var lia = document.createElement("a");
    // lia.className = "it-track";

    var div = '<p><span class="align-left bold clipped">' + inTrack.name + '</span>';
    div = div + '<span class="align-right">' + Config.userDate(inTrack.date) + '</span></p>';
    div = div + '<p class="new-line"><span class="align-left">' + Config.userDistance(inTrack.distance) + '</span>';
    var d = inTrack.duration / 60000;
    div = div + '<span class="align-right">' + d.toFixed() + 'min</span></p>';
    lia.innerHTML = div;
    li.appendChild(lia);
    document.getElementById("tracks-list").appendChild(li);
    lia.addEventListener("click", function(e){
      // console.log("click: track " + inTrack + "will be displayed");
      document.querySelector("#trackView").classList.remove("move-right");
      document.querySelector("#trackView").classList.add("move-center");
      Controller.displayTrack(inTrack);
    });
  }

  function __remove_childs(parent) {
    var d = document.getElementById(parent).childNodes;
    console.log("d",d);
    for (i = 0; i <= d.length; i++) {
      document.getElementById(parent).removeChild(d[i]);
      console.log("remove element " + i + " " + d[i]);
    }
  }

  return {
    display: display,
    reset: reset
  };

}();