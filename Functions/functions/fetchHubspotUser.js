const FunctionTokenValidator = require('twilio-flex-token-validator').functionValidator;
const fetch = require("node-fetch");


exports.handler = FunctionTokenValidator(async function (context, event, callback) {
  const {
    email
  } = event;

  try {
    const request = await fetch(`https://api.hubapi.com/crm/v3/owners/?email=${email}&limit=1`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.HUBSPOT_TOKEN}`
      }
    });

    if (!request.ok) {
      throw new Error('Error while retrieving data from hubspot');
    }

    const data = await request.json();
    
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    response.setBody(data);
    // Return a success response using the callback function.
    callback(null, response);
  } catch (err) {
    if (err instanceof Error) {
      const response = new Twilio.Response();
      response.appendHeader("Access-Control-Allow-Origin", "*");
      response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
      response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

      response.appendHeader("Content-Type", "plain/text");
      response.setBody(err.message);
      response.setStatusCode(500);
      // If there's an error, send an error response
      // Keep using the response object for CORS purposes
      console.error(err);
      callback(null, response);
    } else {
      callback(null, {});
    }

  }
})
