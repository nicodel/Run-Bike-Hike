"use strict;"
// var Events = function() {

/******************
 * EVENT LISTENER *
*******************/

/*----------------- Home View -----------------*/
/* Home View Tracks button */
document.querySelector("#btn-tracks").addEventListener ("click", function () {
  Controller.displayTracks();
  document.getElementById("views").showCard(3);
});

/* Home View Start tracking button */
document.querySelector("#btn-start-stop").addEventListener ("click", function () {
  Controller.toggleWatch();
  // document.getElementById("views").showCard(1);
});

/* Home View settings button */
document.querySelector("#btn-settings").addEventListener ("click", function () {
  document.getElementById("views").showCard(0);
});

/*----------------- Infos View -----------------*/
/* Infos View Stop button */
// document.querySelector("#btn-stop").addEventListener ("click", function () {
//     document.getElementById("views").showCard(3);
// });

/* Infos Map button */
// document.querySelector("#btn-map").addEventListener ("click", function () {
//   console.log("flipping!");
//   document.getElementById("infos-flipbox").toggle();
//   Controller.flippingTrack(document.getElementById("infos-flipbox").flipped);
// });



/*-------- Stop tracking confirmation ------------*/
/* Stop tracking Confirm button */
document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
    Controller.stopWatch();
});
/* Stop tracking Cancel button */
document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});
document.getElementById("stop-form-confirm").onsubmit = function() {return false;};

/*----------------- Settings View -----------------*/
/* Settings View Screen keep alive radio button */
document.querySelector("#screen").onchange = function () {
  Controller.savingSettings("screen", this.checked);
  Controller.toggleScreen(this.checked);
  console.log("this.checked", this.checked);
};
/* Settings View Language selection */
document.querySelector("#language").onchange = function() {
  var dom = document.querySelector("#language");
  var id = this.selectedIndex;
  Controller.savingSettings("language", dom[id].value);
  Controller.changeLanguage(dom[id].value);
  document.webL10n.setLanguage(dom[id].value);



};
/* Settings View Distance unit selection */
document.querySelector("#distance").onchange = function() {
  var dom = document.querySelector("#distance");
  var id = this.selectedIndex;
  Controller.savingSettings("distance", dom[id].value);
  Controller.changeDistance(dom[id].value);
};
/* Settings View Speed unit selection */
document.querySelector("#speed").onchange = function() {
  var dom = document.querySelector("#speed");
  var id = this.selectedIndex;
  Controller.savingSettings("speed", dom[id].value);
  Controller.changeSpeed(dom[id].value);
};
/* Settings View Position unit selection */
document.querySelector("#position").onchange = function() {
  var dom = document.querySelector("#position");
  var id = this.selectedIndex;
  Controller.savingSettings("position", dom[id].value);
  Controller.changePosition(dom[id].value);
};
/* Settings View Back button */
document.querySelector("#btn-settings-back").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});


/*----------------- Tracks View -----------------*/
/* Tracks View Back button */
document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});
/* Tracks View Import button */
document.querySelector("#btn-import").addEventListener ("click", function () {
  document.getElementById("views").showCard(8);
});
/* Import Cancel button */
document.querySelector("#btn-cancel-import").addEventListener("click", function() {
  document.getElementById("views").showCard(3);
});
/* Import Confirm button */
document.querySelector("#btn-confirm-import").addEventListener("click", function() {
  Controller.importFile(document.querySelector("#select-file").value);
});
document.querySelector("#select-file").onchange = function() {
  var dom = document.querySelector("#select-file");
  var id = this.selectedIndex;
  // console.log("import select changed", dom[id].value);
  if (dom[id].value === "empty") {
    document.getElementById("btn-confirm-import").setAttribute("disabled", "disabled");
  } else {
    document.getElementById("btn-confirm-import").removeAttribute("disabled");
  };
};
document.getElementById("import-form").onsubmit = function() {return false;};


/*----------------- Track Detail View -----------------*/
/* Track View Back button */
document.querySelector("#btn-track-back").addEventListener ("click", function () {
  Controller.displayTracks();
  document.getElementById("views").showCard(3);
});
/* Track View Delete button */
document.querySelector("#btn-delete").addEventListener ("click", function () {
  document.getElementById("views").showCard(5);
});
/* Track View Rename button */
document.querySelector("#btn-rename").addEventListener("click", function() {
  console.log("renaming");
  document.querySelector("#input-rename").value = Controller.getTrackName();
  document.getElementById("views").showCard(6);
});
/* Rename Cancel button */
document.querySelector("#btn-cancel-rename").addEventListener("click", function() {
  document.getElementById("views").showCard(4);
});
/* Rename Confirm button */
document.querySelector("#btn-confirm-rename").addEventListener("click", function() {
  document.getElementById("views").showCard(4);
  var new_name = document.querySelector("#input-rename");
  Controller.renameTrack(new_name.value);
});
/* Rename Clear button */
document.querySelector("#btn-clear-rename").addEventListener("click", function() {
  document.querySelector("#input-rename").value = "";
});
document.getElementById("rename-form").onsubmit = function() {return false;};

/* Don't take focus from the input field */
document.querySelector("#btn-clear-rename").addEventListener('mousedown', function(e) {
  e.preventDefault();
});

/* Track View Share button */
document.querySelector("#btn-share").addEventListener("click", function() {
  console.Log("exporting");
  document.getElementById("views").showCard(7);
  // setting it to default
  document.querySelector("#select-share").value = "local";
  /*document.querySelector("#toggle-share-summary").disabled = true;
  document.querySelector("#toggle-share-summary").checked = false;
  document.querySelector("#toggle-share-file").disabled = true;
  document.querySelector("#toggle-share-file").checked = true;*/
});

/*----------------- Track Share Form -----------------*/
/* Way to share a track selection */
/*document.querySelector("#select-share").onchange = function() {
  var dom = document.querySelector("#select-share");
  var id = this.selectedIndex;
  if (dom[id].value === "email") {
    console.log("sharing via email");
    document.querySelector("#toggle-share-summary").disabled = false;
    document.querySelector("#toggle-share-summary").checked = false;
    document.querySelector("#toggle-share-file").disabled = false;
    document.querySelector("#toggle-share-file").checked = false;
  } else if (dom[id].value === "twitter") {
    console.log("sharing via twitter");
    document.querySelector("#toggle-share-summary").disabled = true;
    document.querySelector("#toggle-share-summary").checked = true;
    document.querySelector("#toggle-share-file").disabled = true;
    document.querySelector("#toggle-share-file").checked = false;
  } else if (dom[id].value === "local") {
    console.log("sharing via local");
    document.querySelector("#toggle-share-summary").disabled = true;
    document.querySelector("#toggle-share-summary").checked = false;
    document.querySelector("#toggle-share-file").disabled = true;
    document.querySelector("#toggle-share-file").checked = true;
  };
};*/

/* Share Cancel button */
document.querySelector("#btn-cancel-share").addEventListener("click", function() {
  document.getElementById("views").showCard(4);
});
/* Share Confirm button */
document.querySelector("#btn-confirm-share").addEventListener("click", function() {
  var file, summary = false;
  /*if (document.querySelector("#toggle-share-file").value) {
    // export file
    file = true;
  } else if (document.querySelector("#toggle-share-summary").value) {
    // create summary
    summary = true;
  } else {
    // no selection made ???
  };*/
  var share = document.querySelector("#select-share").value;
  console.log("ready to share", share);
  document.getElementById("views").showCard(4);
  Controller.shareTrack(file, summary, share);
});
document.getElementById("share-form").onsubmit = function() {return false;};

/*----------------- Track Delete Confirmation -----------------*/
/* Delete Track Cancel button */
document.querySelector("#btn-cancel-delete").addEventListener("click", function () {
  document.getElementById("views").showCard(4);
});
/* Delete Track Confirm button */
document.querySelector("#btn-confirm-delete").addEventListener("click", function () {
  document.getElementById("views").showCard(3);
  Controller.deleteTrack();
});
document.getElementById("del-form-confirm").onsubmit = function() {return false;};




// }();





/* TEMPORARY TRACK SELECTION */
// document.querySelector("#TR-2014421-15195").addEventListener("click", function () {
//   document.getElementById("views").showCard(5);
//   Controller.displayTrack(testdata);
// });

/*document.querySelector("#dev-import").addEventListener("click", function () {
  Controller.importForDev();
});*/
