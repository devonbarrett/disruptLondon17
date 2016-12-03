var twapi = require('tropo-webapi');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
var fs = require('fs');
var stream = require('stream');
var childproc = require('child_process');
var bot = require('../bot.js');

function unfuckRecord(tropo, opts) {
  /*
     opts = opts || {};
     opts.attempts = opts.attempts || 1;
     opts.bargein = opts.bargein === undefined ? true : false;
     opts.beep = opts.beep === undefined ? true : false;
     */

  return tropo.tropo.push({ record: opts })
};

function doRecord(prompt) {
  var tropo = new twapi.TropoWebAPI();
  /*
  tropo.tropo = [
    {say: [{value: 'Starting recording now!'}]},
    {startRecording: {
      name: 'segment1',
      url: 'http://app.spoken.tech/tropo/translate',
      format: 'audio/wav',
    }},
    {wait: {milliseconds: 10000}},
    {stopRecording: null},
    {startRecording: {
      name: 'segment2',
      url: 'http://app.spoken.tech/tropo/translate',
      format: 'audio/wav',
    }},
    {wait: {milliseconds: 10000}},
    {stopRecording: null},
  ]
  */
  //prompt = !!prompt;
  var say = prompt ? { 'value': 'Tell us a few words in spanish' } : null;
  unfuckRecord(tropo, {
    say: say,
    maxSilence: 1,
    bargein: false,
    maxTime: 10,
    url: 'http://app.spoken.tech/tropo/translate',
    format: 'audio/wav',
    beep: prompt,
  });
  tropo.tropo.push({
      on: [{
        event: 'continue',
        next: '/tropo/continue',
      }, {
        event: 'incomplete',
        next: '/tropo/incomplete',
      }, {
        event: 'error',
        next: '/tropo/error',
      }, {
        event: 'hangup',
        next: '/tropo/hangup',
      }
    ]
  });
  return twapi.TropoJSON(tropo);
}

module.exports = {
  callStart: function() {
    return doRecord(true);
  },

  callContinue: function() {
    return doRecord();
  },

  translate: function(file) {
    var speech_to_text = new SpeechToTextV1({
      username: process.env.WATSON_USER,
      password: process.env.WATSON_PASSWORD
    });

    var params = {
      content_type: 'audio/wav',
      model: 'es-ES_NarrowbandModel',
    };

    // create the stream
    var recognizeStream = speech_to_text.createRecognizeStream(params);

    var s = new stream.PassThrough();
    s.end(file.buffer);
    // pipe in some audio

    recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events
    recognizeStream.on('data', function(chunk) {
      translate(chunk, function(trans) {
        trans.translations.forEach(function(textObj) {
          bot.sendChatMsg(textObj.translation, 'twooster@gmail.com');
        });
      });
    });

    s.pipe(recognizeStream);
    return {};
  },
};

function translate(text, cb) {
  var language_translator = new LanguageTranslatorV2({
    username: process.env.WATSON_LT_USER,
    password: process.env.WATSON_LT_PASSWORD,
    version: 'v2',
    url: 'https://gateway.watsonplatform.net/language-translator/api' 
  });

  text = text.toLowerCase().trim();
  var args = {
    model_id: 'es-en-conversational',
    text: text,
  };
  console.log('Translation args:', args);
  language_translator.translate(args, function (err, translation) {
    if (err) {
      console.log('translation error:', err);
    } else {
       cb(translation);
    }
  });
}
