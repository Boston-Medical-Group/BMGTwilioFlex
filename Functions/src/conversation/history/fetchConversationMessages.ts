import '@twilio-labs/serverless-runtime-types';
import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { functionValidator as TokenValidator } from "twilio-flex-token-validator";
import { MessageInstance } from "twilio/lib/rest/conversations/v1/conversation/message";
import * as twilio from 'twilio';
const MAX_MESSAGES_TO_FETCH = 100;

/* Returns the messages within a given conversation */
const getConversationMessages = async (client: twilio.Twilio, conversationSid: string) : Promise<Array<any>> => {
    var result : Array<any> = [];
    var messages : MessageInstance[] = await client.conversations.v1.conversations(conversationSid)
        .messages
        .list({ limit: MAX_MESSAGES_TO_FETCH })

    //create a result object with the information we want to supply
    for await (const message of messages) {

        let media = JSON.stringify(message.media);

        try {
            let msg = JSON.parse(`{
                "index": "${message.index}",
                "author": "${message.author}", 
                "body": "${message.body}",
                "media": ${media},
                "dateCreated": "${message.dateCreated}"
                }`);
            result.push(msg);
        } catch (e) {
        }
    }
    return result;
}

type MyEvent = {
    conversationSid: string
}

//@ts-ignore
export const handler = TokenValidator(async function (
    context: Context,
    event: MyEvent,
    callback: ServerlessCallback
) {
    // Access the NodeJS Helper Library by calling context.getTwilioClient()
    const client = context.getTwilioClient();

    // Create a custom Twilio Response
    //@ts-ignore
    const response = new Twilio.Response();

    // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    var conversationSid = event.conversationSid;

    //validate if a conversationSid has been provided
    if (!conversationSid) {
        response.setBody(JSON.parse(`{"error": "no conversationSid provided"}`));
        response.setStatusCode(200);
        callback(null, response);
    }

    //@ts-ignore
    const request = await getConversationMessages(client, conversationSid).then(function (resp) {
        // handle success 
        var data = resp;
        if (typeof data !== 'undefined') {
            response.setBody(data);
        } else {
            response.setBody(JSON.parse(`{"result": "error"}`));
        }

        response.setStatusCode(200);
        callback(null, response);
    })
});