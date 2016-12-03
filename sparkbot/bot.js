
var Flint = require('node-flint');
// flint options
var config = {
  token: '***REMOVED***',
};

var flint = new Flint(config);
flint.start();

module.exports = {
  sendChatMsg: function(msg, email) {
    var bot = flint.bots.filter(function(b) {
      return b.email === 'spoken@sparkbot.io';
    })[0];
    bot.dm(email, msg);
  }
}
