var sparkHooks = require('../webhooks/spark.js');
var tropoHooks = require('../webhooks/tropo.js');

var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();

router.get('/sparkhook', function(req, res, next) {
  res.send(sparkHooks.processCMD());
});

router.all('/tropo/start', function(req, res, next) {
  res.send(tropoHooks.callStart());
});

router.all('/tropo/continue', function(req, res, next) {
  res.send(tropoHooks.callContinue());
});

router.all('/tropo/translate', upload.any(), function(req, res, next) {
  res.send(tropoHooks.translate(req.files[0]));
});


module.exports = router;
