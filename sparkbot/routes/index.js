var sparkHooks = require('../webhooks/spark.js');

var express = require('express');
var router = express.Router();

router.get('/sparkhook', function(req, res, next) {
  res.send(sparkHooks.processCMD());
});

module.exports = router;
