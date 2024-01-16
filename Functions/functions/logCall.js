const FunctionTokenValidator = require('twilio-flex-token-validator').functionValidator;
const fetch = require("node-fetch");

exports.handler = FunctionTokenValidator(async function (_,  event,  callback) {
  console.log(event);

  const {
    hs_bject_id,
    hs_call_callee_object_id,
    hs_timestamp,
    hs_call_body,
    hs_call_callee_object_type_id,
    hs_call_direction,
    hs_call_disposition,
    hs_call_duration,
    hs_call_from_number,
    hs_call_to_number,
    hs_call_recording_url,
    hs_call_status,
    hubspot_owner_id,
    hubspot_deal_id
  } = event

  try {
    if (!hs_call_callee_object_id) {
      throw new Error('CRMID Inválido');
    }

    const toHubspot = {
      properties: {
        hs_call_callee_object_id,
        hs_timestamp,
        hs_call_body,
        hs_call_direction,
        hs_call_duration,
        hs_call_from_number,
        hs_call_to_number,
        hs_call_recording_url,
        hs_call_status,
        hs_call_disposition,
        hubspot_owner_id
      },
      associations: [
        {
          to: {
            id: hs_call_callee_object_id
          },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 194
            }
          ]
        }
      ]
    };

    if (hubspot_deal_id !== undefined && hubspot_deal_id !== null) {
      toHubspot.associations.push({
        to: {
          id: hubspot_deal_id
        },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 206
          }
        ]
      })
    }

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    
    const request = await fetch(`https://api.hubapi.com/crm/v3/objects/calls`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${_.HUBSPOT_TOKEN}`
      },
      body: JSON.stringify(toHubspot)
    });

    if (request.ok) {
      response.setBody({
        statusText: request.statusText,
        error: request.error()
      })
      console.log(request)
      callback(null, response);
      return;
    }

    const data = await request.json();
    
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
