/* jshint browser: true, strict: true, devel: true */
/* global Controller, TracksView, FxDeviceStorage, DynamicMap */

/******************
 * EVENT LISTENER *
*******************/

/*----------------- Home View -----------------*/
/* Home View Tracks button */
document.querySelector("#btn-tracks").addEventListener ("click", function () {
  "use strict";
  Controller.displayTracks();
  document.getElementById("views").showCard(3);
});

/* Home View Start tracking button */
document.querySelector("#btn-start-stop").addEventListener ("click", function () {
  "use strict";
  Controller.toggleWatch();
  // document.getElementById("views").showCard(1);
});

/* Home View settings button */
document.querySelector("#btn-settings").addEventListener ("click", function () {
  "use strict";
  document.getElementById("views").showCard(0);
  var ab = document.getElementsByClassName("about");
  for (var k = 0; k < ab.length; k++) {
    var e = ab[k].childNodes;
    for(var j = 0; j < e.length; j++){
      if (e[j].tagName === "A") {
        console.log("adding _blank to", e[j]);
        e[j].target = "_blank";
      }
    }
  }
});
/* Home View Pause/Play tracking button */
document.querySelector("#btn-pause").addEventListener ("click", function () {
  "use strict";
  Controller.pauseRecording();
});

/*-------- Stop tracking confirmation ------------*/
/* Stop tracking Confirm button */
document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
  "use strict";
  TracksView.reset();
  document.getElementById("views").showCard(1);
  Controller.stopWatch();
});
/* Stop tracking Cancel button */
document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
  "use strict";
  document.getElementById("views").showCard(1);
});
document.getElementById("stop-form-confirm").onsubmit = function() {
  "use strict";
  return false;
};

/*----------------- Settings View -----------------*/
/* Settings View Screen keep alive radio button */
document.querySelector("#screen").onchange = function () {
  "use strict";
  Controller.savingSettings("screen", this.checked);
  Controller.toggleScreen(this.checked);
  console.log("this.checked", this.checked);
};
/* Settings View Language selection */
document.querySelector("#language").onchange = function() {
  "use strict";
  var setting = this[this.selectedIndex].value;
  Controller.savingSettings("language", setting);
  Controller.changeLanguage(setting);
  document.webL10n.setLanguage(setting);
  TracksView.reset();
};
/* Settings View Distance unit selection */
document.querySelector("#distance").onchange = function() {
  "use strict";
  var setting = this[this.selectedIndex].value;
  Controller.savingSettings("distance", setting);
  Controller.changeDistance(setting);
  TracksView.reset();
};
/* Settings View Speed unit selection */
document.querySelector("#speed").onchange = function() {
  "use strict";
  var setting = this[this.selectedIndex].value;
  Controller.savingSettings("speed", setting);
  Controller.changeSpeed(setting);
  TracksView.reset();
};
/* Settings View Position unit selection */
document.querySelector("#position").onchange = function() {
  "use strict";
  var setting = this[this.selectedIndex].value;
  Controller.savingSettings("position", setting);
  Controller.changePosition(setting);
};
/* Settings View Geoposition frequency selection */
document.querySelector("#frequency").onchange = function() {
  "use strict";
  var setting = this[this.selectedIndex].value;
  Controller.savingSettings("frequency", setting);
  Controller.changeFrequency(setting);
};
/* Settings View Storage selection */
document.querySelector("#storage").onchange = function() {
  "use strict";
  console.log("change storage");
  var setting = this[this.selectedIndex].value;
  Controller.savingSettings("storage", setting);
  Controller.changeStorage(setting);
};
/* Settings View Back button */
document.querySelector("#btn-settings-back").addEventListener ("click", function () {
  "use strict";
  document.getElementById("views").showCard(1);
});


/*----------------- Tracks View -----------------*/
/* Tracks View Back button */
document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
  "use strict";
  document.getElementById("views").showCard(1);
});

/* Tracks View Import button */
document.querySelector("#btn-import").addEventListener ("click", function () {
  "use strict";
  document.querySelector("#btn-confirm-import").setAttribute("disabled", "disabled");
  if (FxDeviceStorage.compatible) {
    Controller.searchFiles();
  } else {
    Controller.showInput();
  }
  document.getElementById("views").showCard(8);
});
/* Import Cancel button */
document.querySelector("#btn-cancel-import").addEventListener("click", function() {
  "use strict";
  document.getElementById("views").showCard(3);
  Controller.resetImportList();
});
/* Import Confirm button */
document.querySelector("#btn-confirm-import").addEventListener("click", function() {
  "use strict";
  if (FxDeviceStorage.compatible) {
    Controller.importFile(document.querySelector("#select-file").value);
  } else {
    Controller.importFile(document.getElementById("input-file").files);
  }
});
document.querySelector("#select-file").onchange = function() {
  "use strict";
  var id = this.selectedIndex;
  if (this[id].value === "empty") {
    document.getElementById("btn-confirm-import").setAttribute("disabled", "disabled");
  } else {
    Controller.enableImport();
  }
};
document.getElementById("import-form").onsubmit = function() {
  "use strict";
  return false;
};
document.getElementById("input-file").onchange = function() {
  "use strict";
  Controller.enableImport();
};

/*----------------- Track Detail View -----------------*/
/* Track View Back button */
document.querySelector("#btn-track-back").addEventListener ("click", function () {
  "use strict";
  DynamicMap.removeMap();
  Controller.displayTracks();
  document.getElementById("views").showCard(3);
});
/* Track View Delete button */
document.querySelector("#btn-delete").addEventListener ("click", function () {
  "use strict";
  document.getElementById("views").showCard(5);
});
/* Track View Edit button */
document.querySelector("#btn-edit").addEventListener("click", function() {
  "use strict";
  var info = Controller.getTrackInfo();
  console.log("editing track", info);
  document.querySelector("#input-rename").value = info.name;
  document.getElementById("views").showCard(6);
  [].forEach.call(document.querySelectorAll("#icons-list img"), function(el) {
    el.classList.remove("active");
  });
  if(typeof info.icon === undefined || document.getElementById("icon-" + info.icon) === null) {
    info.icon = "default";
  }
  document.getElementById("icon-" + info.icon).classList.add("active");
});

/*----------------- Track Edit View -------------------*/
/* Edit Cancel button */
document.querySelector("#btn-cancel-edit").addEventListener("click", function() {
  "use strict";
  document.getElementById("views").showCard(4);
});
/* Edit Confirm button */
document.querySelector("#btn-confirm-edit").addEventListener("click", function() {
  "use strict";
  document.getElementById("views").showCard(4);
  var icon = document.querySelector("#icons-list img.active");
  Controller.editTrack(
    document.querySelector("#input-rename").value,
    (icon !== null) ? icon.id.slice(5) : "default"
  );
  TracksView.reset();
});
/* Rename Clear button */
document.querySelector("#btn-clear-rename").addEventListener("click", function() {
  "use strict";
  document.querySelector("#input-rename").value = "";
});
document.getElementById("edit-form").onsubmit = function() {
  "use strict";
  return false;
};
/* Don't take focus from the input field */
document.querySelector("#btn-clear-rename").addEventListener('mousedown', function(e) {
  "use strict";
  e.preventDefault();
});
/* Select track icon on click */
[].forEach.call(document.querySelectorAll("#icons-list img"), function(el) {
  "use strict";
  el.addEventListener("click", function() {
    [].forEach.call(document.querySelectorAll("#icons-list img"), function(el) {
      el.classList.remove("active");
    });
    this.classList.add("active");
  });
});

/* Track View Share button */
document.querySelector("#btn-share").addEventListener("click", function() {
  "use strict";
  if (FxDeviceStorage.compatible) {
    console.log("exporting");
    // setting it to default
    document.querySelector('[name="radio-share"]').value = "on-device";
  } else {
    for (var i = 0; i < document.getElementsByName("radio-share").length; i++) {
      var node = document.getElementsByName("radio-share")[i];
      if (node.value === "on-device") {
        node.setAttribute("disabled", true);
      }
    }
  }
    document.getElementById("views").showCard(7);
});

document.forms['share-form'].addEventListener("click", function() {
  "use strict";
  console.log('click', this.elements['radio-share']);
});
/* Share Cancel button */
document.querySelector("#btn-cancel-share").addEventListener("click", function() {
  "use strict";
  document.getElementById("views").showCard(4);
});
/* Share Confirm button */
document.querySelector("#btn-confirm-share").addEventListener("click", function() {
  "use strict";
  // var share = document.forms['share-form'].elements["radio-share"].value; // only works for FF 2.0 an later
  var radiolist = document.forms["share-form"].elements["radio-share"];
  var share;
  for (var i = 0; i < radiolist.length; i++) {
    if (radiolist[i].checked) {
      share = radiolist[i].value;
    }
  }
  console.log("ready to share", share);
  document.getElementById("views").showCard(4);
  Controller.shareTrack(share);
});
document.getElementById("share-form").onsubmit = function() {
  "use strict";
  return false;
};

/*----------------- Track Delete Confirmation -----------------*/
/* Delete Track Cancel button */
document.querySelector("#btn-cancel-delete").addEventListener("click", function () {
  "use strict";
  document.getElementById("views").showCard(4);
});
/* Delete Track Confirm button */
document.querySelector("#btn-confirm-delete").addEventListener("click", function () {
  "use strict";
  Controller.deleteTrack();
});
document.getElementById("del-form-confirm").onsubmit = function() {
  "use strict";
  return false;
};




// }();





/* TEMPORARY TRACK SELECTION */
// document.querySelector("#TR-2014421-15195").addEventListener("click", function () {
//   document.getElementById("views").showCard(5);
//   Controller.displayTrack(testdata);
// });

/*document.querySelector("#dev-import").addEventListener("click", function () {
  Controller.importForDev();
});*/
