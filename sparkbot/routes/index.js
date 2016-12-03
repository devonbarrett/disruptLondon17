var sparkHooks = require('../webhooks/spark.js');
var tropoHooks = require('../webhooks/tropo.js');

var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();

router.get('/sparkhook', function(req, res, next) {
  res.send(sparkHooks.processCMD());
});

router.all('/tropo/es/start', function(req, res, next) {
  res.send(tropoHooks.startSpanish());
});

router.all('/tropo/es/continue', function(req, res, next) {
  res.send(tropoHooks.continueSpanish());
});

router.all('/tropo/es/translate', upload.any(), function(req, res, next) {
  res.send(tropoHooks.translateSpanish(req.files[0]));
});

router.all('/tropo/en/start', function(req, res, next) {
  res.send(tropoHooks.startEnglish());
});

router.all('/tropo/en/continue', function(req, res, next) {
  res.send(tropoHooks.continueEnglish());
});

router.all('/tropo/en/translate', upload.any(), function(req, res, next) {
  res.send(tropoHooks.translateEnglish(req.files[0]));
});


module.exports = router;
