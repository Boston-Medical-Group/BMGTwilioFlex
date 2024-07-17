import '@twilio-labs/serverless-runtime-types';
import { Context } from '@twilio-labs/serverless-runtime-types/types';
import { Callback, functionValidator as FunctionTokenValidator, validator as TokenValidator } from 'twilio-flex-token-validator'
import * as twilio from 'twilio';
import { ParticipantConversationInstance } from 'twilio/lib/rest/conversations/v1/participantConversation';
import { ConversationInstance } from 'twilio/lib/rest/conversations/v1/conversation';


type MyEvent = {
    page: string
}

type MyContext = {
    TWILIO_PHONE_NUMBER: string
    TWILIO_WA_PHONE_NUMBER: string
    ACCOUNT_SID: string
    AUTH_TOKEN: string
    TASK_ROUTER_WORKSPACE_SID: string
    TASK_ROUTER_WORKFLOW_SID: string
    TASK_ROUTER_QUEUE_SID: string
    FLEX_APP_OUTBOUND_WHATSAPP_QUEUE_SID: string
    INBOUND_SMS_STUDIO_FLOW: string
}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: Callback
) {
    //@ts-ignore
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    try {
        let sendResponse = {};
        if (event.page) {
            await context.getTwilioClient().conversations.v1.conversations.getPage(event.page).then((data) => {
                sendResponse = data
            })
        } else {
            await context.getTwilioClient().conversations.v1.conversations.page({
                //@ts-ignore
                state: "active",
                pageSize: 20,
                pageToken: event.page
            }).then((data) => {
                sendResponse = data
            })
        }

        response.setBody(sendResponse);
        // Return a success response using the callback function.
    } catch (err) {
        response.setStatusCode(500);
        if (err instanceof Error) {
            response.setBody({ error: err.message });
        } else {
            response.setBody({ error: err});
        }
    }

    callback(null, response);
});