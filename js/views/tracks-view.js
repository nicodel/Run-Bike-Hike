/* jshint browser: true, strict: true, devel: true */
/* exported TracksView */
/* global _, Config */

var TracksView = function() {
  "use strict";

  function display(inTracks, displayTrackCallback) {
    var list = document.getElementById("tracks-list");
    console.log("list.childNodes",list.childNodes);
/*    for (i = 0; i = list.childNodes.length - 1; i++) {
      if (list.childNodes[i]) {
        if (list.childNodes[i].className === "it-track") {
          console.log("cleaning element " + i + " " + list.childNodes[i]);
          list.removeChild(list.childNodes[i]);
        } else {
          console.log("element " + i + " " + list.childNodes[i]);
        }
      }
      console.log("remove element " + i + " " + list.childNodes[i].textContent);
      document.getElementById("tracks-list").removeChild(list.childNodes[i]);
    }*/
    console.log("inTracks", inTracks);
    if (inTracks.length === 0) {
      __showEmpty();
    } else {
      var tracks = [];
      tracks = inTracks;
      for (var i = tracks.length - 1; i >= 0; i--) {
        __buildList(tracks[i], displayTrackCallback);
        //console.log("buildList i ", i);
      }
    }
    document.getElementById("list-spinner").className = "hidden behind";

    /*
     * TESTING !!!
     */
/*    var div = '<p><span class="align-left bold clipped">' + inTrack.name + '</span>';
    div = div + '<span class="align-right">' + Config.userDate(inTrack.date) + '</span></p>';
    div = div + '<p class="new-line"><span class="align-left">' + Config.userDistance(inTrack.distance) + '</span>';
    var d = inTrack.duration / 60000;
    div = div + '<span class="align-right">' + d.toFixed() + 'min</span></p>';
    lia.innerHTML = div;
    li.appendChild(lia);
    document.getElementById("tracks-list").appendChild(li);
    lia.addEventListener("click", function(e){
      console.log("click: track " + inTrack + "will be displayed");
      document.querySelector("#trackView").classList.remove("move-right");
      document.querySelector("#trackView").classList.add("move-center");
      Controller.displayTrack(inTrack);
    });*/
    /*
     *
     */
  }

  function reset() {
    console.log("Tracks list marked as dirty.");
    document.getElementById("tracks-list").dataset.state = "dirty";
    if (document.getElementById("tracks-list").hasChildNodes()) {
      document.getElementById("tracks-list").innerHTML = "";
      document.getElementById("list-spinner").className = "";
    }
  }

  function __showEmpty() {
    var el = document.createElement("p");
    el.className = "empty-tracks";
    el.innerHTML = _("empty-list"); // "Empty tracks list.";
    document.getElementById("tracks-list").appendChild(el);
  }

  function __buildList(inTrack, displayTrackCallback) {
    // console.log("__buildList - inTrack: ", inTrack);
    var li = document.createElement("li");
    li.className = "it-track";
    var lia = document.createElement("a");
    var a = Config.userDistance(inTrack.distance);
    var div = '<p class="track-title">';
    if (inTrack.icon === null || inTrack.icon === undefined) {
       inTrack.icon = "default";
    }
    div = div + '<img class="track-icon" src="img/activities/' + inTrack.icon + '.svg" />';
    div = div + '<span class="track-name">' + inTrack.name + '</span>';
    div = div + '</p><p class="track-description">';
    if (inTrack.date === 0) {
      div = div + '<span class="track-date">--/--/--</span>';
    } else {
      div = div + '<span class="track-date">' + Config.userDate(inTrack.date) + '</span>';
    }
    div = div + '<span class="track-length">' + a.v + " " + a.u + '</span>';
    div = div + '<span class="track-duration">' + (isNaN(inTrack.duration) ? '--' : (inTrack.duration / 60000).toFixed()) + ' min</span>';
    div = div + '</p>';
    lia.innerHTML = div;
    li.appendChild(lia);
    document.getElementById("tracks-list").appendChild(li);
    lia.addEventListener("click", function(){
      // console.log("click: track " + inTrack + "will be displayed");
      document.getElementById("views").showCard(4);
      displayTrackCallback(inTrack);
    });
  }

  return {
    display: display,
    reset: reset
  };

}();
