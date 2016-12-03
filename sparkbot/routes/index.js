var sparkHooks = require('../webhooks/spark.js');
var tropoHooks = require('../webhooks/tropo.js');

var express = require('express');
var router = express.Router();

router.get('/sparkhook', function(req, res, next) {
  res.send(sparkHooks.processCMD());
});

router.get('/tropo', function(req, res, next) {
  res.send(tropoHooks.incomingCall());
});

module.exports = router;
