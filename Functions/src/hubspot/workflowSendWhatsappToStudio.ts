import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types"

type MyContext = {
    ACCOUNT_SID: string
    AUTH_TOKEN: string
    TWILIO_WA_PHONE_NUMBER: string
    TWILIO_WA_IA_STUDIO_FLOW: string
    TWILIO_WA_IA_STUDIO_URL?: string
}

type MyEvent = {
    request: any,
    cookies: any,
    phone: string
    firstname: string
    lastname: string
    fullname: string
    email: string
    contact_id: string
    message?: string
    template?: string
    agentfirstname?: string
    agentlastname?: string
    flowSid?: string
}

export const handler = async (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) => {

    const authHeader = event.request.headers.authorization;
    const response = new Twilio.Response();

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

    const client = context.getTwilioClient()

    try {
        const whatsappAddressTo = event.phone.indexOf('whatsapp:') === -1 ? `whatsapp:${event.phone}` : `${event.phone}`
        const whatsappAddressFrom = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? `whatsapp:${context.TWILIO_WA_PHONE_NUMBER}` : `${context.TWILIO_WA_PHONE_NUMBER}`
        const timestamp = (new Date).getTime();
        await client.conversations.v1.conversations.create({
            friendlyName: `IATrainer -> ${event.phone} (${timestamp})`,
            attributes: JSON.stringify({
                customerName: event.fullname,
                name: event.fullname,
                crmid: event.contact_id,
                hubspot_contact_id: event.contact_id
            }),
            timers: {
                inactive: 'PT1H',
                closed: 'PT24H'
            }
        }).then(async (conversation) => {
            return await client.conversations.v1.conversations(conversation.sid).participants.create({
                //@ts-ignore
                "messagingBinding.address": whatsappAddressTo,
                "messagingBinding.proxyAddress": whatsappAddressFrom
            }).then(async (participant) => {
                return await client.conversations.v1.conversations(conversation.sid).webhooks.create({
                    target: 'studio',
                    //@ts-ignore
                    "configuration.flowSid": event.flowSid
                }).then(async (webhook) => {
                    if (event.message) {
                        return await client.conversations.v1.conversations(conversation.sid).messages.create({
                            body: event.message
                        })
                    } else if (event.template) {
                        return await client.conversations.v1.conversations(conversation.sid).messages.create({
                            contentSid: event.template,
                            contentVariables: JSON.stringify({
                                agentfirstname: event.agentfirstname,
                                agentlastname: event.agentlastname,
                                contactfirstname: event.firstname,
                                contactlastname: event.lastname
                            })
                        })
                    }
                })
            })
        })

        callback(null, 'OK')
    } catch (error) {
        console.log(error)
        callback(null, 'ERROR')
    }

}

const setUnauthorized = (response : any) => {
    response
        .setBody('Unauthorized')
        .setStatusCode(401)
        .appendHeader(
            'WWW-Authenticate',
            'Basic realm="Authentication Required"'
        );

    return response;
};