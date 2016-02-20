/* jshint strict: true, node: true */
'use strict';

var express     = require('express');
var router      = express.Router();
var bodyParser  = require('body-parser');

var Docs        = require('./controllers/docs');
var Preferences = require('./controllers/preferences');

router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path, req.body);
  next();
});
router.use(bodyParser.json({limit: '5mb'}));
router.use(bodyParser.urlencoded({extended: true}));

// GET '/': render main page
router.get('/', function(req, res) {
  res.render('index'); /*, function(err, html) {
      res.status(200).send(html);
    });*/
});

// PUT '/': ??
router.put('/', function(req, res) {
  console.log('got put /', req, res);
});

// GET 'sessions': get all stored sessions, truncated (without gps cooordinates)
router.get('/docs', Docs.getAll);

// GET 'sessions/:id': get one complete session
router.get('/docs/:id', Docs.getOne);

// POST 'sessions': save a new session
router.post('/docs', Docs.add);

// PUT '/sessions:id': update a session
router.put('/docs/:id', Docs.add);

// GET '/preferences': get preferences
router.get('/preferences', Preferences.getAll);

// GET '/preferences:id': get preferences
router.get('/preferences/:id', Preferences.getAll);

// POST '/preferences': save preferences
router.post('/preferences', Preferences.update);

// PUT '/preferences': save preferences
router.put('/preferences', Preferences.update);

// PUT '/preferences/:id': save preferences
router.put('/preferences/:id', Preferences.update);

module.exports = router;

