var webhook = require('node-flint/webhook');
var express = require('express');
var router = express.Router();

var flint = require('../bot.js').flint;

// define express path for incoming webhooks
router.post('/', webhook(flint));

module.exports = router;
