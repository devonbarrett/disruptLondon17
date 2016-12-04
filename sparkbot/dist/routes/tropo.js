var tropoHooks = require('../webhooks/tropo.js');
var router = require('express').Router();
var upload = require('multer')();

router.all('/es/start', function (req, res, next) {
  res.send(tropoHooks.startSpanish());
});

router.all('/es/continue', function (req, res, next) {
  res.send(tropoHooks.continueSpanish());
});

router.all('/es/translate', upload.any(), function (req, res, next) {
  res.send(tropoHooks.translateSpanish(req.files[0]));
});

router.all('/en/start', function (req, res, next) {
  res.send(tropoHooks.startEnglish());
});

router.all('/en/continue', function (req, res, next) {
  res.send(tropoHooks.continueEnglish());
});

router.all('/en/translate', upload.any(), function (req, res, next) {
  res.send(tropoHooks.translateEnglish(req.files[0]));
});

module.exports = router;