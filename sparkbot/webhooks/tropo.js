var twapi = require('tropo-webapi');

var recordDefaults = {
  attempts: 1,
  baregin: true,
  beep: true,
  format: 'audio/wav'
};

function unfuckRecord(tropo, opts) {
  opts = opts || {};
  opts.attempts = opts.attempt || 1;
  opts.bargein = opts.bargein === undefined ? true : false;
  opts.beep = opts.beep === undefined ? true : false;

  return tropo.record(
    opts.attempts,
    opts.asyncUpload,
    opts.bargein,
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
    opts.username,
    opts.voice,
    opts.allowSignals,
    opts.interdigitTimeout);
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
