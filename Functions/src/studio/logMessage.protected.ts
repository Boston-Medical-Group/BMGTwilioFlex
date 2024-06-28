import { functionValidator as TokenValidator } from "twilio-flex-token-validator";
import { MessageInstance } from "twilio/lib/rest/conversations/v1/conversation/message";
import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { Client as HubspotClient } from "@hubspot/api-client";
import { SimplePublicObjectInputForCreate } from "@hubspot/api-client/lib/codegen/crm/objects/communications";
import { ConversationContext, ConversationInstance } from "twilio/lib/rest/conversations/v1/conversation";


const getHtmlMessage = async (messages : MessageInstance[]) => {
    let resultHtml = '<ul style="list-style:none;padding:0;">';

    try {

        let bgColor = 'transparent';
        messages.forEach(message => {
            bgColor = bgColor === 'transparent' ? '#0091ae12' : 'transparent';
            resultHtml += `<li style="background-color: ${bgColor};border: 1px solid #cfdae1;padding: 5px;margin-bottom: 4px;"><div style="color: #5d7185;font-weight: bold;margin-bottom:5px;"><span class="">${message.author}</span> - <span style="color: #738ba3;font-size: 9px;">${message.dateCreated.toLocaleString()}</span></div><div style="padding: 6px;color: #333f4d;"><p>${message.body}</p></div></li>`
        })

        resultHtml += '</ul>';

    } catch (err) {
        console.error(`Oeps, something is wrong ${err}`);
    }

    return resultHtml;
}

const getMessages = async (context : Context, conversation : ConversationContext | any) => {
    let messages : any = [];
    try {
        messages = await conversation
            .messages
            .list({ limit: 500 });
    } catch (err) {
        console.error(`Oeps, something is wrong ${err}`);
    }

    return messages;
}

type MyContext = {
    HUBSPOT_TOKEN: string,
}

type MyEvent = {
    conversationSid : string
    hubspot_contact_id: string
    hubspot_deal_id? : string
    hs_communication_channel_type: string
    hs_communication_logged_from: string
    hs_communication_body: string
    hubspot_owner_id?: string
}

export const handler = async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) {

    const {
        conversationSid,
        hubspot_contact_id,
        hubspot_deal_id,
        hs_communication_channel_type,
        hs_communication_logged_from,
        hs_communication_body,
        hubspot_owner_id
    } = event

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");

    const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
    try {
        if (!hubspot_contact_id) {
            throw new Error('CRMID Inválido');
        }

        const conversationContext = context.getTwilioClient().conversations.v1.conversations(conversationSid);
        const conversation = await conversationContext.fetch()

        let logBody = hs_communication_body;
        logBody += '<br /><br />';
        const conversationMessages = await getMessages(context, conversationContext);
        logBody += await getHtmlMessage(conversationMessages);

        let toHubspot : SimplePublicObjectInputForCreate = {
            properties: {
                hs_communication_channel_type,
                hs_communication_logged_from,
                hs_communication_body: logBody,
                hubspot_owner_id: hubspot_owner_id ?? ''
            },
            associations: [
                {
                    to: {
                        id: hubspot_contact_id
                    },
                    types: [
                        {
                            associationCategory: "HUBSPOT_DEFINED",
                            associationTypeId: 81
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
                        associationTypeId: 85
                    }
                ]
            })
        }

        const communication = await hubspotClient.crm.objects.communications.basicApi.create(toHubspot);
        response.setBody(communication);
        // Return a success response using the callback function.
    } catch (err) {

        if (err instanceof Error) {
            response.setBody(err);
            response.setStatusCode(500);
            // If there's an error, send an error response
            // Keep using the response object for CORS purposes
            console.error(err);
        } else {
            response.setBody({});
        }
    }

    callback(null, response);
}
