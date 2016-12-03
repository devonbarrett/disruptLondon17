var sparkHooks = require('../webhooks/spark.js');
var tropoHooks = require('../webhooks/tropo.js');

var express = require('express');
var router = express.Router();

router.get('/sparkhook', function(req, res, next) {
  res.send(sparkHooks.processCMD());
});

router.all('/tropo/start', function(req, res, next) {
  res.send(tropoHooks.callStart());
});

router.get('/tropo/translate', function(req, res, next) {
  res.send(tropoHooks.translate());
});


module.exports = router;
