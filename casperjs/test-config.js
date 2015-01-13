/* jshint browser: true, devel: true, strict: true, phantom: true */
/* global casper, Config */
// casperjs test test-config.js --includes=../js/models/config.js --verbose
// var require = patchRequire(require);
var fs = require("fs");
var vm = require('vm');
vm.runInThisContext(fs.readFileSync("../js/models/config.js"));
// var Config  = require("../js/models/config.js");
/*Config.CONFIG = [
  {screen: false},
  {language: "en"},
  {distance: "0"},
  {speed: "0"},
  {position: "0"},
  {frequency: "auto"}
];*/
casper.test.begin("Testing Config", 1, function suite (test) {
  "use strict";
  console.log("Config", JSON.stringify(Config));
  test.info("Config.userSpeed");
  test.assertEquals(Config.userSpeed(null), {v:"--", u:"km/h"}, "null");
  test.assertEquals(Config.userSpeed(-6), {v:"--", u:"km/h"}, "-6");
  test.done();
/*  for (var i = 0; i < DEFAULT_CONFIG.length; i++) {
    var param = DEFAULT_CONFIG[i];
    if (param === "screen") {
      Config.change("SCREEN_KEEP_ALIVE", DEFAULT_CONFIG[param]);
    } else if (param === "distance") {
      Config.change("USER_DISTANCE", DEFAULT_CONFIG[param]);
    } else if (param === "speed") {
      Config.change("USER_SPEED", DEFAULT_CONFIG[param]);
    } else if (param === "position") {
      Config.change("USER_POSITION_FORMAT", DEFAULT_CONFIG[param]);
    }
  }
  Config.CONFIG = DEFAULT_CONFIG;
  test.info("Config.userSpeed");
  var cases = [
    [null, "--"],
    [-6, "--"],
    [NaN, "--"],
    [Infinity, "--"],
    [100, 360]
  ];
  for (var i = 0; i < cases.length; i++) {
    var cas = cases[i]
    var speed = Config.userSpeed(cas[0]);
    test.assertEquals(speed.v, cas[1], "for " + cas[0]);
  }
  
  test.done();*/
});
