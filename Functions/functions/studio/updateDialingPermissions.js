"use strict";
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(function (context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  client.voice.v1.dialingPermissions
      .bulkCountryUpdates
      .create({
        updateRequest: event.data
      })
      .then((bulk_country_update) => {
      response.appendHeader('Content-Type', 'application/json');
      response.setBody({ content : bulk_country_update });
      return callback(null, response);
      }
  ).catch((err) => {
      response.appendHeader('Content-Type', 'plain/text');
      response.setBody(err.message);
      response.setStatusCode(500);
      return callback(null, response);
  });  
});