var twapi = require('tropo-webapi');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');

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
    twapi.TropoJSON(tropo);

    var speech_to_text = new SpeechToTextV1({
      username: process.env.WATSON_USER,
      password: process.env.WATSON_PASSWORD
    });

    var params = {
      content_type: 'audio/wav'
    };

    // create the stream
    var recognizeStream = speech_to_text.createRecognizeStream(params);

    // pipe in some audio
    fs.createReadStream(req.files[0].buffer).pipe(recognizeStream);

    // and pipe out the transcription
    recognizeStream.pipe(fs.createWriteStream('transcription.txt'));


    // listen for 'data' events for just the final text
    // listen for 'results' events to get the raw JSON with interim results, timings, etc.

    recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events

    ['data', 'results', 'error', 'connection-close'].forEach(function(eventName) {
      recognizeStream.on(eventName, console.log.bind(console, eventName + ' event: '));
    });

  },
};
