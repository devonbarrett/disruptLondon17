var twapi = require('tropo-webapi');

module.exports = {
  incomingCall: function() {
    var tropo = new twapi.TropoWebAPI();
    tropo.say("Welcome to Tropo!");
    return twapi.TropoJSON(tropo);
  },
};
