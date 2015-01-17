/* jshint browser: true, devel: true, strict: true, phantom: true */
/* global casper, Config */

// casperjs test test-config.js --includes=../js/models/config.js --verbose

casper.test.begin("Testing Config", 36, function suite (test) {
  "use strict";
  test.info("Config.userSpeed - km/h");
  test.assertEquals(Config.userSpeed(null), {v:"--", u:"km/h"}, "null");
  test.assertEquals(Config.userSpeed(-6), {v:"--", u:"km/h"}, "-6");
  test.assertEquals(Config.userSpeed(NaN), {v:"--", u:"km/h"}, "NaN");
  test.assertEquals(Config.userSpeed(Infinity), {v:"--", u:"km/h"}, "Infinity");
  test.assertEquals(Config.userSpeed(100), {v:"360.0", u:"km/h"}, "100");
  
  test.info("Config.userSpeed - mph");
  Config.CONFIG.speed = "1";
  test.assertEquals(Config.userSpeed(null), {v:"--", u:"mph"}, "null");
  test.assertEquals(Config.userSpeed(-6), {v:"--", u:"mph"}, "-6");
  test.assertEquals(Config.userSpeed(NaN), {v:"--", u:"mph"}, "NaN");
  test.assertEquals(Config.userSpeed(Infinity), {v:"--", u:"mph"}, "Infinity");
  test.assertEquals(Config.userSpeed(100), {v:"223.7", u:"mph"}, "100");

  test.info("Config.userLatitude - 49°08'06.22");
  test.assertEquals(Config.userLatitude(47.448559000), "47°26'54.81\"N", "47.448559000");
  test.info("Config.userLatitude - 49°08.104'");
  Config.CONFIG.position = "1";
  test.assertEquals(Config.userLatitude(47.448559000), "N 47°26.914'", "47.448559000");
  test.info("Confif.userLatitude - 49.135060");
  Config.CONFIG.position = "2";
  test.assertEquals(Config.userLatitude(47.448559000), 47.448559, "47.448559000");

  test.info("Config.userLongitude - 49°08'06.22");
  Config.CONFIG.position = "0";
  test.assertEquals(Config.userLongitude(47.448559000), "47°26'54.81\"E", "47.448559000");
  test.info("Config.userLongitude - 49°08.104'");
  Config.CONFIG.position = "1";
  test.assertEquals(Config.userLongitude(47.448559000), "E 47°26.914'", "47.448559000");
  test.info("Confif.userLongitude - 49.135060");
  Config.CONFIG.position = "2";
  test.assertEquals(Config.userLongitude(47.448559000), 47.448559, "47.448559000");

  test.info("Config.userSmallDistance - m");
  test.assertEquals(Config.userSmallDistance(null), {v:"--", u:"m"}, "null");
  test.assertEquals(Config.userSmallDistance(-6), {v:"--", u:"m"}, "-6");
  test.assertEquals(Config.userSmallDistance(NaN), {v:"--", u:"m"}, "NaN");
  test.assertEquals(Config.userSmallDistance(Infinity), {v:"--", u:"m"}, "Infinity");
  test.assertEquals(Config.userSmallDistance(100), {v:"100", u:"m"}, "100");

  test.info("Config.userSmallDistance - ft");
  Config.CONFIG.distance = "1";
  test.assertEquals(Config.userSmallDistance(null), {v:"--", u:"ft"}, "null");
  test.assertEquals(Config.userSmallDistance(-6), {v:"--", u:"ft"}, "-6");
  test.assertEquals(Config.userSmallDistance(NaN), {v:"--", u:"ft"}, "NaN");
  test.assertEquals(Config.userSmallDistance(Infinity), {v:"--", u:"ft"}, "Infinity");
  test.assertEquals(Config.userSmallDistance(100), {v:"328", u:"ft"}, "100");
 
  test.info("Config.userDistance - m");
  Config.CONFIG.distance = "0";
  test.assertEquals(Config.userDistance(null), {v:"--", u:"km"}, "null");
  test.assertEquals(Config.userDistance(-6), {v:"--", u:"km"}, "-6");
  test.assertEquals(Config.userDistance(NaN), {v:"--", u:"km"}, "NaN");
  test.assertEquals(Config.userDistance(Infinity), {v:"--", u:"km"}, "Infinity");
  test.assertEquals(Config.userDistance(100), {v:"0.1", u:"km"}, "100");

  test.info("Config.userDistance - ft");
  Config.CONFIG.distance = "1";
  test.assertEquals(Config.userDistance(null), {v:"--", u:"miles"}, "null");
  test.assertEquals(Config.userDistance(-6), {v:"--", u:"miles"}, "-6");
  test.assertEquals(Config.userDistance(NaN), {v:"--", u:"miles"}, "NaN");
  test.assertEquals(Config.userDistance(Infinity), {v:"--", u:"miles"}, "Infinity");
  test.assertEquals(Config.userDistance(100), {v:"0.1", u:"miles"}, "100");
 
  test.done();
});
