/* This function is used to add a participant to a conversation before we close it, 
* so that the live chat session can be surfaced on the previous chat conversations
*/
import '@twilio-labs/serverless-runtime-types';
import { Context, ServerlessFunctionSignature, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { HandlerFn, Context as ValidatedContext, functionValidator as TokenValidator } from "twilio-flex-token-validator";
import { ParticipantInstance } from 'twilio/lib/rest/conversations/v1/conversation/participant';
import Twilio from 'twilio/lib/rest/Twilio';

//adds a messaging binding address (phone number) to an existing conversation
//@ts-ignore
async function addParticipant(client: Twilio, conversationSid: string, address: string) : Promise<void|ParticipantInstance> {
    //need to check if this is a phone number, otherwise we might invoke this with a chat identity 
    if (!address.startsWith('+')) {
        console.log("the address (phone number) provided does not start with a +. Address provided: ", address)
        return;
    }
    const addParticipant = await client.conversations.v1.conversations(conversationSid)
        .participants
        .create({
            "messagingBinding.address": address
        })
        .then(participant => console.log(participant.sid));
}

type MyEvent = {
    conversationSid: string;
    address: string;
}

//@ts-ignore
export const handler: ServerlessFunctionSignature = TokenValidator(async function (
//export const handler: ServerlessFunctionSignature = async function (
    context: Context & ValidatedContext,
    event: {} & MyEvent,
    callback: ServerlessCallback
) {

    const client = context.getTwilioClient();
    //@ts-ignore
    const response = new Twilio.Response();

    // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    var conversationSid = event.conversationSid;
    var address = event.address;

    //validate if parameters are missing
    if (!conversationSid || !address) {
        response.setBody(JSON.parse(`{"error": "malformed request"}`));
        response.setStatusCode(200);
        callback(null, response);
    }

    //@ts-ignore
    const request = await addParticipant(client, conversationSid, address).then(function (resp) {
        var data = resp;
        if (typeof data !== 'undefined') {
            response.setBody(data);
        }
        //handle error
        else response.setBody(JSON.parse(`{"result": "error"}`));

        response.setStatusCode(200);
        callback(null, response);
    })
});
//};