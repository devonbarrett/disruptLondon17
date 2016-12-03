var twapi = require('tropo-webapi');

function unfuckRecord(tropo, opts) {
  opts = opts || {};
  // function(attempts, bargein, beep, choices, format, maxSilence, maxTime,
  //          method, minConfidence, name, required, say, timeout,
  //          transcription, url, password, username)
  return tropo.record(opts.attempts,
               opts.bargain,
               opts.beep,
               opts.choices,
               opts.format,
               opts.maxSilence,
               opts.maxTime,
               opts.method,
               opts.minConfidence,
               opts.name,
               opts.required,
               opts.say,
               opts.timeout,
               opts.transcription,
               opts.url,
               opts.password,
               opts.username)

};

module.exports = {
  callStart: function() {
    var tropo = new twapi.TropoWebAPI();

    unfuckRecord(tropo, {
      say: 'Tell us a few words in spanish',
      url: 'http://app.spoken.tech/tropo/translate'
    });
    return twapi.TropoJSON(tropo);
  },

  translate: function() {
    console.log(arguments);

    var tropo = new twapi.TropoWebAPI();
    tropo.say('You are a trooper');
    tropo.hangup();
    return twapi.TropoJSON(tropo);
  },
};
