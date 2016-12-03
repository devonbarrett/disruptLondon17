var twapi = require('tropo-webapi');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
var fs = require('fs');
var stream = require('stream');
var childproc = require('child_process');

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
      bargein: true,
      maxTime: 10,
      url: 'http://app.spoken.tech/tropo/translate',
      format: 'audio/wav',
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

  translate: function(file) {

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

    var child = childproc.exec('sox - out.wav rate 16000', {}, function() {
      var result =    fs.createReadStream('out.wav');
      result.pipe(recognizeStream);
      recognizeStream.pipe(fs.createWriteStream('transcription.txt'));


      // listen for 'data' events for just the final text
      // listen for 'results' events to get the raw JSON with interim results, timings, etc.

      recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events

      ['data', 'results', 'error', 'connection-close'].forEach(function(eventName) {
        recognizeStream.on(eventName, console.log.bind(console, eventName + ' event: '));
            });
    });
    child.stdin.write(file.buffer);

return;


/*
    fs.writeFileSync('input.wav', file.buffer);
    var decoded = nodewav.decode(file.buffer);
    var encoded = nodewav.encode(decoded.channelData, { sampleRate: 16000, float: true, bitDepth: 16 });
    fs.writeFileSync('upsampled.wav', encoded);
    var s = new stream.PassThrough();
    s.end(encoded);
    // pipe in some audio
    s.pipe(recognizeStream);
*/

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

function translate() {
  var language_translator = new LanguageTranslatorV2({
    username: process.env.WATSON_LT_USERNAME,
    password: process.env.WATSON_LT_PASSWORD,
  });

  language_translator.translate({
    text: 'A sentence must have a verb', source : 'en', target: 'es' },
    function (err, translation) {
      if (err)
        console.log('error:', err);
      else
        console.log(JSON.stringify(translation, null, 2));
    });


  // Create a translation model using a tmx file
  // language_translator.createModel({
  //     base_model_id: 'en-fr',
  //         name:'my-model',
  //             forced_glossary: fs.createReadStream('resources/glossary.tmx')
  //               }, function (err, model) {
  //                   if (err)
  //                         console.log('error:', err);
  //                             else
  //                                   console.log(JSON.stringify(model, null, 2));
  //                                   });
}
