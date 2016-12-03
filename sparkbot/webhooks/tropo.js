var twapi = require('tropo-webapi');

function unfuckRecord(tropo, opts) {
/*
  opts = opts || {};
  opts.attempts = opts.attempts || 1;
  opts.bargein = opts.bargein === undefined ? true : false;
  opts.beep = opts.beep === undefined ? true : false;
*/

  return tropo.tropo.push({ record: opts })
};

module.exports = {
  callStart: function() {
    var tropo = new twapi.TropoWebAPI();

    unfuckRecord(tropo, {
      say: { 'value': 'Tell us a few words in spanish' },
      maxSilence: 3,
      maxTime: 10,
      url: 'http://app.spoken.tech/tropo/translate',
      format: 'audio/mp3',
    });
    tropo.tropo.push({
      on: {
        event: 'continue',
        next: '/tropo/answer',
        required: 'true',
      },
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
