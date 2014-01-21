// var Events = function() {

/******************
 * EVENT LISTENER *
*******************/

/*----------------- Home View -----------------*/
/* Home View Tracks button */
document.querySelector("#btn-tracks").addEventListener ("click", function () {
  Controller.displayTracks();
  document.querySelector("#tracksView").classList.remove("move-right");
  document.querySelector("#tracksView").classList.add("move-center");
})

/* Home View Start tracking button */
document.querySelector("#btn-start").addEventListener ("click", function () {
  Controller.startWatch();
  document.querySelector("#infosView").classList.remove("move-right");
  document.querySelector("#infosView").classList.add("move-center");
})

/*----------------- Infos View -----------------*/
/* Infos View Stop button */
document.querySelector("#btn-stop").addEventListener ("click", function () {
    document.getElementById("stop-form-confirm").classList.remove("hidden");
})

/*-------- Stop tracking confirmation ------------*/
/* Stop tracking Confirm button */
document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
  document.querySelector("#infosView").classList.remove("move-center");
  document.querySelector("#infosView").classList.add("move-right");
  document.getElementById("stop-form-confirm").classList.add("hidden");
    Controller.stopWatch();
})
/* Stop tracking Cancel button */
document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
    document.getElementById("stop-form-confirm").classList.add("hidden");
})

/*----------------- Settings View -----------------*/
/* Settings View Screen keep alive radio button */
document.querySelector("#screen").onchange = function () {
  Controller.savingSettings("screen", this.checked);
  // if (this.checked) {
  //   lock = window.navigator.requestWakeLock('screen');
  //   window.addEventListener('unload', function () {
  //     lock.unlock();
  //   })
  // } else{
  //   window.navigator.requestWakeLock('screen').unlock();
  // };
  Controller.toogleScreen(this.checked);
  console.log("this.checked", this.checked);
  // Controller.savingSettings("screen", this.checked);
}
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


/*----------------- Tracks View -----------------*/
/* Tracks View Back button */
document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
  document.querySelector("#tracksView").classList.remove("move-center");
  document.querySelector("#tracksView").classList.add("move-right");
})

/*----------------- Track Detail View -----------------*/
/* Track View Back button */
document.querySelector("#btn-track-back").addEventListener ("click", function () {
  document.querySelector("#trackView").classList.remove("move-center");
  document.querySelector("#trackView").classList.add("move-right");
})
/* Track View Delete button */
document.querySelector("#btn-delete").addEventListener ("click", function () {
  document.getElementById("del-form-confirm").classList.remove("hidden");
});

/*----------------- Track Delete Confirmation -----------------*/
/* Delete Track Cancel button */
document.querySelector("#btn-cancel-delete").addEventListener("click", function () {
  document.getElementById("del-form-confirm").classList.add("hidden");
})
/* Delete Track Confirm button */
document.querySelector("#btn-confirm-delete").addEventListener("click", function () {
  document.querySelector("#trackView").classList.remove("move-center");
  document.querySelector("#trackView").classList.add("move-right");
  document.getElementById("del-form-confirm").classList.add("hidden");
  Controller.deleteTrack();
})
// }();