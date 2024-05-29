import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types"

type MyContext = {
    ACCOUNT_SID: string
    AUTH_TOKEN: string
    TWILIO_WA_PHONE_NUMBER: string
}

type MyEvent = {
    request: any,
    cookies: any,
    template?: string
    message?: string
    flowSid: string
    contactId?: string
    phone: string
    [key: string] : string | undefined
}

/**
 * 
 * Available parameters:
 * - template?
 * - message?
 * - flowSid
 * - contactId?
 * - phone
 * - objectId?
 * - objectType?
 * - param_*?
 * 
 */

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

    let parameters: Object = Object.keys(event)
        .filter((k) => k.indexOf('param_') == 0)
        .reduce((newObj, k) => {
            let propName = k.replace('param_', '');
            //@ts-ignore
            newObj[parseInt(propName)] = event[k];
            return newObj;
        }, {})
    
    let attributes: { [key: string] : string } = Object.keys(event)
        .filter((k) => k.indexOf('param_') != 0)
        .reduce((newObj, k) => {
            //@ts-ignore
            newObj[k] = event[k];
            return newObj;
        }, {})
    
    const currentlyRequiredAttributes = ['customerName', 'name', 'crmid', 'hubspot_contact_id'];
    currentlyRequiredAttributes.forEach((k) => {
        if (!attributes.hasOwnProperty(k)) {
            if (k == 'customerName' || k == 'name') {
                attributes[k] = event.fullname ?? 'Unknown name';
            } else if (k == 'crmid' || k == 'hubspot_contact_id') {
                attributes[k] = event.contactId as string
            }
        }
    })

    try {
        const whatsappAddressTo = event.phone.indexOf('whatsapp:') === -1 ? `whatsapp:${event.phone}` : `${event.phone}`
        const whatsappAddressFrom = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? `whatsapp:${context.TWILIO_WA_PHONE_NUMBER}` : `${context.TWILIO_WA_PHONE_NUMBER}`
        const timestamp = (new Date).getTime();
        await client.conversations.v1.conversations.create({
            friendlyName: `HubspotWorkflow -> ${event.phone} (${timestamp})`,
            attributes: JSON.stringify(attributes),
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
                            contentVariables: JSON.stringify(parameters)
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