

/**
 * Esta funcion debe ser pública para procesar envío de Whatsapps desde Hubspot
 */
exports.handler = async function (
    context,
    event,
    callback
) {

    console.log(event);
    // Prepare a new Twilio response for the incoming request
    //@ts-ignore
    const response = new Twilio.Response()
    // Grab the standard HTTP Authorization header
    const authHeader = event.request.headers.authorization;

    const { template, to, params } = event

    // Reject requests that don't have an Authorization header
    if (!authHeader) return callback(null, setUnauthorized(response));

    // The auth type and credentials are separated by a space, split them
    const [authType, credentials] = authHeader.split(' ');
    // If the auth type doesn't match Basic, reject the request
    if (authType.toLowerCase() !== 'basic')
        return callback(null, setUnauthorized(response));

    // The credentials are a base64 encoded string of 'username:password',
    // decode and split them back into the username and passwo rd
    const [username, password] = Buffer.from(credentials, 'base64')
        .toString()
        .split(':');
    // If the username or password don't match the expected values, reject
    if (username !== context.ACCOUNT_SID || password !== context.AUTH_TOKEN)
        return callback(null, setUnauthorized(response));

    // If we've made it this far, the request is authorized!
    // At this point, you could do whatever you want with the request.
    // For this example, we'll just return a 200 OK response.

    const result = await sendWATemplate(context, template, to, params ?? [])

    return callback(null, result);
};

// Helper method to format the response as a 401 Unauthorized response
// with the appropriate headers and values
//@ts-ignore
const setUnauthorized = (response) => {
    response
        .setBody('Unauthorized')
        .setStatusCode(401)
        .appendHeader(
            'WWW-Authenticate',
            'Basic realm="Authentication Required"'
        );

    return response;
}

const sendWATemplate = async (context, template, to, params) => {
    const channel = to.includes('whatsapp') ? 'whatsapp' : 'sms';
    const from = channel === 'whatsapp' ? `whatsapp:${context.TWILIO_WA_PHONE_NUMBER}` : context.TWILIO_PHONE_NUMBER;

    const body = parseTemplate(context, template, params)

    return await sendOutboundMessage(
        context.getTwilioClient(),
        template,
        to,
        from,
        body,
        context.INBOUND_SMS_STUDIO_FLOW
    );
}

/**
 * 
 * @param {import("@twilio-labs/serverless-runtime-types/types").TwilioClient} client 
 * @param {*} template 
 * @param {*} To 
 * @param {*} From 
 * @param {*} Body 
 * @param {*} studioFlowSid 
 * @returns 
 */
const sendOutboundMessage = async (client, template, To, From, Body, studioFlowSid) => {
    const friendlyName = `Outbound ${From} -> ${To}`;

    let conversation = await client.conversations.v1.participantConversations
        .list({ address: To, limit: 50 })
        .then(async participantConversations => {
            const conversations = participantConversations.filter((p) => p.conversationState === 'active')
            const participantConversation = conversations[0] || null
            console.log(participantConversation)
            if (participantConversation) {
                return await client.conversations.v1.conversations(participantConversation.conversationSid)
                    .fetch()
                    .then(c => {
                        return c
                    })
                    .catch(() => null);
            }

            return null;
        });

    if (conversation === null) {
        // Create Channel
        conversation = await client.conversations.conversations.create({
            friendlyName,
            attributes: JSON.stringify({ usedTemplate: template })
        });

        // Add customer to channel
        await client.conversations
            .v1
            .conversations(conversation.sid)
            .participants.create({
                messagingBinding: {
                    address: To,
                    proxyAddress: From
                }
            });
    }

    // Point the channel to Studio
    await client.conversations
        .v1
        .conversations(conversation.sid)
        .webhooks.create({
            target: "studio",
            configuration: {
                flowSid: studioFlowSid,
            }
        });

    // Add agents initial message
    await client.conversations
        .v1
        .conversations(conversation.sid)
        .messages.create({ author: 'Bot', body: Body });

    return { success: true, channelSid: conversation.sid };
};

/**
 * 
 * @param {import("@twilio-labs/serverless-runtime-types/types").Context} context 
 * @param {*} template 
 * @param {*} params 
 * @returns 
 */
const parseTemplate = (context, template, params) => {
    const client = context.getTwilioClient();
    client.messaging.absoluteUrl
    let body = template;
    for (let i = 0; i < params.length; i++) {
        body = body.replace(`{{${i}}}`, params[i]);
    }
    console.log('PARSEDTEMPLATE', body);
    return body;
}