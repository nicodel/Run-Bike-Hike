/* jshint strict: true, node: true */
'use strict';
var americano = require('americano');

var server_dir = __dirname + '/../www';
if (process.env.NODE_ENV === 'dev') {
  server_dir = __dirname + '/../client';
}

module.exports = {
  common: [
    americano.bodyParser({limit: '5mb'}),
    americano.methodOverride(),
    americano.errorHandler({
      dumpExceptions: true,
      showStack: true
    }),
    americano.static(server_dir, {
      maxAge: 86400000
    })
  ],

  development: [
    americano.logger('dev')
  ],

  production: [
    americano.logger('short')
  ],

  plugins: [
    'cozydb'
  ]
};
