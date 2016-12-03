var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var express = require('express');
var router = express.Router();

// flint options
var config = {
  webhookUrl: 'https://app.spoken.tech/flint',
  token: '***REMOVED***',
  port: 80
};

// init flint
var flint = new Flint(config);
flint.start();

// say hello
flint.hears('call', function(bot, trigger) {
  bot.dm(trigger.personEmail, "Beep! Boop! You call is ready. Please dial +44 1223 790430 to start");
});

// define express path for incoming webhooks
router.post('/', webhook(flint));

process.on('SIGINT', function() {
  flint.stop().then(function() {
    process.exit();
  });
});

module.exports = router;
