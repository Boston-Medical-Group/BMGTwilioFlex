/* NOT IN USE - ALTERNATIVE TO fetchAllConversationsByParticipant if you want to keep whatsapp / sms separate
* Fetches all conversations by a participant.
* The participant is either a phone number i.e. +447123123123 or a whatsapp:++447123123123 
* If the participant is a chat participant, the chat is being tied to a from address //TODO MODIFIED FROM?
*/
import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { functionValidator as TokenValidator } from "twilio-flex-token-validator";
import * as twilio from 'twilio';

const MAX_CONVERSATIONS_TO_FETCH = 100;
const MAX_CONVERSATIONS_TO_PRESENT = 20;
const MAX_PERIOD = 12;

/* Returns the conversations list in order. 
** Applies filter startDate > date, where date is at a maximum the MAX_PERIOD */
const getConversationsList = async  (client: twilio.Twilio, fromAddress: string) => {
    var result = [];

    //fetch conversations with filters
    var conversationsList = await client
        .conversations
        .v1
        .participantConversations
        .list({ address: fromAddress, limit: MAX_CONVERSATIONS_TO_FETCH })//.then( convos => {console.log(convos)})

    //sort by date created 
    //@ts-ignore
    conversationsList.sort((a, b) => new Date(b.conversationDateCreated) - new Date(a.conversationDateCreated));

    //remove those that are not to be presented
    if (MAX_CONVERSATIONS_TO_FETCH > MAX_CONVERSATIONS_TO_PRESENT) {
        conversationsList
            .splice(MAX_CONVERSATIONS_TO_PRESENT, MAX_CONVERSATIONS_TO_FETCH - MAX_CONVERSATIONS_TO_PRESENT);
    }
    //create a result object with the information we want to supply
    for await (const conversation of conversationsList) {
        //this will identify whatsapps as whatsapp, sms and chat as sms (because we're adding a messaging binding to chats)
        let originalChannel = conversation.participantMessagingBinding.type;

        //if the proxy comes out null, it was originally a chat
        if (originalChannel === 'sms') {
            if (!conversation.participantMessagingBinding.proxy_address) {
                originalChannel = 'chat';
            }
        }

        let convo = JSON.parse(`{
        "conversationOriginalChannel": "${originalChannel}",
        "conversationSid": "${conversation.conversationSid}", 
        "conversationDateCreated": "${conversation.conversationDateCreated}",
        "conversationState": "${conversation.conversationState}",
        "from": "${conversation.participantMessagingBinding.address}"
        }`);
        result.push(convo);
    }
    return result;
}

type MyEvent = {
    phoneNumber: string
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
    //initialize vars
    var phoneNumber = '';
    var startDateOffset = MAX_PERIOD;

    // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    //validate if a number has been provided
    if (event.phoneNumber) {
        phoneNumber = event.phoneNumber;
    }
    else {
        response.setBody(JSON.parse(`{"error": "no number provided"}`));
        response.setStatusCode(200);
        callback(null, response);
    }

    //@ts-ignore
    const request = await getConversationsList(client, phoneNumber).then(function (resp) {
        // handle success 
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