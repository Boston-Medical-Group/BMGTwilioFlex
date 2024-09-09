const fetch = require("node-fetch");

//under enviromental variables add you could also add the model under API_MODEL , if not it will default to gpt3.5 turbo.
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const MAX_CONVERSATIONS_TO_FETCH = 5;

async function getAllConversationsList(client, skipSid, fromAddress) {
    var result = [];

    let fromAddressWA;
    //if the original fromAddress is a WhatsApp we need to swap it around
    if (fromAddress.startsWith('whatsapp:')) {
        fromAddressWA = fromAddress;
        fromAddress = fromAddress.slice(9);
    } else {
        fromAddressWA = 'whatsapp:' + fromAddress;
    }

    //fetch conversations with filters
    let conversationsListNumber = await client.conversations.v1.participantConversations.list({
        address: fromAddress,
        limit: MAX_CONVERSATIONS_TO_FETCH
    })

    //fetch conversations with filters
    const conversationsListWA = await client.conversations.v1.participantConversations.list({
        address: fromAddressWA,
        limit: MAX_CONVERSATIONS_TO_FETCH
    })
    conversationsListNumber = conversationsListNumber.concat(conversationsListWA);

    // FIX Para MX
    if (fromAddressWA.startsWith('whatsapp:+521')) {
        //fetch conversations with prefix 52
        const conversationsListWA1 = await client.conversations.v1.participantConversations.list({
            address: fromAddressWA.replace('whatsapp:+521', 'whatsapp:+52'),
            limit: MAX_CONVERSATIONS_TO_FETCH
        })
        conversationsListNumber = conversationsListNumber.concat(conversationsListWA1);
    } else if (fromAddressWA.startsWith('whatsapp:+52')) {
        //fetch conversations with prefix 521
        const conversationsListWA2 = await client.conversations.v1.participantConversations.list({
            address: fromAddressWA.replace('whatsapp:+52', 'whatsapp:+521'),
            limit: MAX_CONVERSATIONS_TO_FETCH
        })
        conversationsListNumber = conversationsListNumber.concat(conversationsListWA2);
    }


    //sort by date created 
    //var conversationsList = conversationsListNumber.concat(conversationsListWA);
    conversationsListNumber.sort((a, b) => new Date(b.conversationDateCreated) - new Date(a.conversationDateCreated));

    //create a result object with the information we want to supply
    for await (const conversation of conversationsListNumber) {
        if (conversation.conversationSid === skipSid) {
            continue;
        }
        
        //this will identify whatsapps as whatsapp, sms and chat as sms (because we're adding a messaging binding to chats)
        let originalChannel = conversation.participantMessagingBinding.type;
        //if the proxy comes out null, it was originally a chat
        if (originalChannel === 'sms') {
            if (!conversation.participantMessagingBinding.proxy_address) {
                originalChannel = 'chat';
            }
        }
        result.push({
            conversationOriginalChannel: originalChannel,
            conversationSid: conversation.conversationSid,
            conversationDateCreated: conversation.conversationDateCreated,
            conversationState: conversation.conversationState,
            from: conversation.participantMessagingBinding.address
        });
    }

    return result;
}

exports.handler = TokenValidator(async (context, event, callback) => {
    //Set CORS headers (for HTTP call Flex --> Function)
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    // Necesito obtener las conversaciones del contacto (SMS o Whatsapp)
    let phone

    //validate if a number has been provided
    if (event.phone) {
        phone = event.phone;
    } else {
        response.setBody({error: "no number provided"});
        response.setStatusCode(200);
        callback(null, response);
        return
    }

    await getAllConversationsList(context.getTwilioClient(), event.skipSid ?? false, phone)
        .then(async (resp) => {
            // handle success 
            var data = resp;
            if (typeof data !== 'undefined') {
                response.setBody(data);
            }
            //handle error
            else response.setBody({result: "error"});
            response.setStatusCode(200);
        })
        .catch(function (err) {
            response.setBody({ error: err });
            response.setStatusCode(200);
        })
    
    callback(null, response);

})