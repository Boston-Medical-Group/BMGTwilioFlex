import { functionValidator as FunctionTokenValidator } from "twilio-flex-token-validator";
import { Client as HubspotClient } from "@hubspot/api-client";
import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { SimplePublicObjectInputForCreate } from "@hubspot/api-client/lib/codegen/crm/objects";
import { SimplePublicObject } from "@hubspot/api-client/lib/codegen/crm/objects";

type MyContext = {
  HUBSPOT_TOKEN: string,
}

type MyEvent = {
  hs_bject_id: string,
  hs_call_callee_object_id: string,
  hs_timestamp: string,
  hs_call_body: string,
  hs_call_callee_object_type_id: string,
  hs_call_direction: string,
  hs_call_disposition: string,
  hs_call_duration: string,
  hs_call_from_number: string,
  hs_call_to_number: string,
  hs_call_recording_url: string,
  hs_call_status: string,
  hubspot_owner_id: string,
  hubspot_deal_id: string
}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {

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

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    if (!hs_call_callee_object_id) {
      throw new Error('CRMID Inválido');
    }

    const toHubspot : SimplePublicObjectInputForCreate = {
      'properties': {
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
      'associations': [
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

    
    
    const hubspotClient = new HubspotClient({ apiKey: context.HUBSPOT_TOKEN });
    await hubspotClient.crm.objects.calls.basicApi.create(toHubspot)
      .then((call: SimplePublicObject) => {
        response.appendHeader("Content-Type", "application/json");
        response.setBody(call);
        // Return a success response using the callback function.
        callback(null, response);
      }).catch((err) => {
        response.appendHeader("Content-Type", "plain/text");
        response.setBody(err.message);
        response.setStatusCode(500);
        // If there's an error, send an error response
        // Keep using the response object for CORS purposes
        console.error(err);
        callback(null, response);
      })
  } catch (err) {

    if (err instanceof Error) {
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
