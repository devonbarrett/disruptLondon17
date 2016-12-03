var Flint = require('node-flint');

// flint options
var config = {
  webhookUrl: 'https://app.spoken.tech/flint',
  token: process.env.FLINT_TOKEN,
  port: 80
};

var flint = new Flint(config);
flint.start();

// say hello
flint.hears('call', function(bot, trigger) {
  bot.dm(trigger.personEmail, "Beep! Boop! You call is ready. Please dial +44 1223 790430 to start");
});

process.on('SIGINT', function() {
  flint.stop().then(function() {
    process.exit();
  });
});

module.exports = {
  sendChatMsg: function(msg, email) {
    var bot = flint.bots.filter(function(b) {
      return b.email === 'spoken@sparkbot.io';
    })[0];
    bot.dm(email, msg);
  },
  flint: flint,
}
