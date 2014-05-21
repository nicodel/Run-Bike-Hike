// var Events = function() {

/******************
 * EVENT LISTENER *
*******************/

/*----------------- Home View -----------------*/
/* Home View Tracks button */
document.querySelector("#btn-tracks").addEventListener ("click", function () {
  // Controller.displayTracks();
  document.getElementById("views").showCard(4);
});

/* Home View Start tracking button */
document.querySelector("#btn-start").addEventListener ("click", function () {
  // Controller.startWatch();
  document.getElementById("views").showCard(2);
});

/* Home View settings button */
document.querySelector("#btn-settings").addEventListener ("click", function () {
  document.getElementById("views").showCard(0);
});

/*----------------- Infos View -----------------*/
/* Infos View Stop button */
document.querySelector("#btn-stop").addEventListener ("click", function () {
    document.getElementById("views").showCard(3);
});

/*-------- Stop tracking confirmation ------------*/
/* Stop tracking Confirm button */
document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
    // Controller.stopWatch();
});
/* Stop tracking Cancel button */
document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
  document.getElementById("views").showCard(2);
});

/*----------------- Settings View -----------------*/
/* Settings View Screen keep alive radio button */
document.querySelector("#screen").onchange = function () {
  Controller.savingSettings("screen", this.checked);
  Controller.toogleScreen(this.checked);
  console.log("this.checked", this.checked);
};
/* Settings View Language selection */
document.querySelector("#language").onchange = function() {
  var dom = document.querySelector("#language");
  var id = this.selectedIndex;
  Controller.savingSettings("language", dom[id].value);
  Controller.changeLanguage(dom[id].value);
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

/*----------------- Track Detail View -----------------*/
/* Track View Back button */
document.querySelector("#btn-track-back").addEventListener ("click", function () {
  document.getElementById("views").showCard(4);
});
/* Track View Delete button */
document.querySelector("#btn-delete").addEventListener ("click", function () {
  document.getElementById("views").showCard(6);
});

/*----------------- Track Delete Confirmation -----------------*/
/* Delete Track Cancel button */
document.querySelector("#btn-cancel-delete").addEventListener("click", function () {
  document.getElementById("views").showCard(5);
});
/* Delete Track Confirm button */
document.querySelector("#btn-confirm-delete").addEventListener("click", function () {
  document.getElementById("views").showCard(4);
  // Controller.deleteTrack();
});
// }();





/* TEMPORARY TRACK SELECTION */
document.querySelector("#TR-2014421-15195").addEventListener("click", function () {
  document.getElementById("views").showCard(5);
  Controller.displayTrack(testdata);
});