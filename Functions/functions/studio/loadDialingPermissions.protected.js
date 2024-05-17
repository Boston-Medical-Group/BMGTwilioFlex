"use strict";
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  await client.voice.v1.dialingPermissions
      .countries
      .list({limit: 256})
      .then((countries) => {
        response.setBody({ content : countries });
      }
  ).catch((err) => {
      response.setBody({ error: err.message });
      response.setStatusCode(500);
  });
  
  return callback(null, response);
});