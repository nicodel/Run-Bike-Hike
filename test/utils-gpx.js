/* jshint strict: true, node: true */
'use strict';

// var assert = require('assert');
require('should');
var domParser = require('xmldom').DOMParser;

var gpx       = require('../client/js/utils/gpx');
var gpxFiles  = require('./gpx-files');

describe('GPX', function() {

  describe('import complete file', function() {
    it('should extract metadata value', function() {
      var p = new domParser();
      gpx.importFile(p.parseFromString(gpxFiles.complete, 'text, xml'), function(res) {
        if (res.error) {
          throw res.error;
        } else {
          res.res.name.should.eql('TR-20150817-084743');
          res.res.duration.should.eql(14.974);
          res.res.distance.should.eql(46.50349234540704);
          res.res.avg_speed.should.eql(3.105615890570792);
          res.res.alt_max.should.eql(68);
          res.res.alt_min.should.eql(60);
          res.res.climb_pos.should.eql(1);
          res.res.climb_neg.should.eql(8);
          var point = res.res.data[0][5];
          point.latitude.should.eql(46.199985);
          point.longitude.should.eql(-1.361167);
          point.date.should.eql(new Date('2015-08-17T07:21:50.773Z'));
          point.altitude.should.eql(65);
          point.speed.should.eql(2.9929583072662354);
          point.accuracy.should.eql(3);
          point.vertAccuracy.should.eql(3);
          point.distance.should.eql(3.2301912864078397);
          point.cumulDistance.should.eql(17.936068540734794);
        }
     });
    });
  });
});

