var twapi = require('tropo-webapi');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
var fs = require('fs');
var stream = require('stream');
var bot = require('../bot.js');

function record(lang, prompt) {
  var tropo = new twapi.TropoWebAPI();

  var say = prompt ? { 'value': prompt } : null;
  tropo.tropo.push({
    record: {
      say: say,
      maxSilence: 1,
      bargein: false,
      maxTime: 10,
      url: 'http://app.spoken.tech/tropo/' + lang + '/translate',
      format: 'audio/wav'
    }
  });
  tropo.tropo.push({
    on: [{
      event: 'continue',
      next: 'http://app.spoken.tech/tropo/' + lang + '/continue'
    }]
  });
  return twapi.TropoJSON(tropo);
}

function makeTranslator(sttModel, ltModel, receiver) {
  return function (file) {
    var speech_to_text = new SpeechToTextV1({
      username: process.env.WATSON_STT_USER,
      password: process.env.WATSON_STT_PASSWORD
    });

    var params = {
      content_type: 'audio/wav',
      model: sttModel
    };

    // create the stream
    var recognizeStream = speech_to_text.createRecognizeStream(params);

    var s = new stream.PassThrough();
    s.end(file.buffer);
    // pipe in some audio

    recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events
    recognizeStream.on('data', function (chunk) {
      translate(chunk, ltModel, function (trans) {
        trans.translations.forEach(function (textObj) {
          bot.sendChatMsg(textObj.translation, receiver);
        });
      });
    });

    s.pipe(recognizeStream);
    return {};
  };
}

function translate(text, ltModel, cb) {
  var language_translator = new LanguageTranslatorV2({
    username: process.env.WATSON_LT_USER,
    password: process.env.WATSON_LT_PASSWORD,
    version: 'v2',
    url: 'https://gateway.watsonplatform.net/language-translator/api'
  });

  text = text.toLowerCase().trim();
  var args = {
    model_id: ltModel,
    text: text
  };
  console.log('translate', ltModel, text);
  language_translator.translate(args, function (err, translation) {
    if (err) {
      console.log('translation error:', err);
    } else {
      cb(translation);
    }
  });
}

module.exports = {
  startSpanish: function () {
    return record('es', 'Please speak to me in Spanish');
  },

  continueSpanish: function () {
    return record('es');
  },

  translateSpanish: makeTranslator('es-ES_NarrowbandModel', 'es-en-conversational', 'twooster@gmail.com'),

  startEnglish: function () {
    return record('en', 'Please speak to me in English');
  },

  continueEnglish: function () {
    return record('en');
  },

  translateEnglish: makeTranslator('en-US_NarrowbandModel', 'en-es-conversational', 'devon@devonbarrett.net')
};