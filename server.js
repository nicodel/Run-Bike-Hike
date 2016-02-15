/* jshint strict: true, node: true */
'use strict';

var americano = require('americano');

var port = process.env.port || 9250;
americano.start({
  name    : 'runbikehike',
  port    : port,
  dbName  : 'docs'
});

