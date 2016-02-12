/* jshint strict: true, node: true */
'use strict';

require('should');
var helpers = require('../client/js/utils/helpers');

describe('HELPERS', function() {
  describe('verify date entry', function() {
    it('should detect correct entry', function() {
      helpers.checkDate('12/10/2015')[0].should.eql(true);
      helpers.checkDate('12/10/2015')[1].should.eql(['12','10','2015']);
    });
    it('should detect wrong entry', function() {
      helpers.checkDate('12.10/2015')[0].should.eql(false);
    });
  });
  describe('verify time entry', function() {
    it('should detect correct entry', function() {
      helpers.checkTime('13:23:22')[0].should.eql(true);
      helpers.checkTime('13:23:22')[1].should.eql(['13','23','22']);
    });
    it('should detect wrong entry', function() {
      helpers.checkTime('25:76:102')[0].should.eql(false);
    });
  });
});
