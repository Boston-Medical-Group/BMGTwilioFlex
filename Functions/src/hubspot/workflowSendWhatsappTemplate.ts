import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types"
import { MessageListInstanceCreateOptions } from "twilio/lib/rest/api/v2010/account/message"

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
    messagingService: string
    phone: string
    altphone?: string
    [key: string] : string | undefined
}

/**
 * 
 * Available parameters:
 * - template?
 * - message?
 * - contactId?
 * - 
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
    
    if (!event.hasOwnProperty('template') && !event.hasOwnProperty('message')) {
        return callback(null, 'ERROR: Missing template or message');
    }

    try {
        let { phone, altphone } = event
        phone = phone == '' ? altphone as string : phone
        if (!phone || phone == undefined || phone == '') {
            console.log('Invalid phone provided')
            return callback('Invalid phone provided')
        }
        phone = phone.toString()

        phone = phone.replace('whatsapp:', '');
        phone = phone.startsWith('+') ? phone : `+${phone}`

        const whatsappAddressTo = `whatsapp:${phone}`
        const messagingService = event.messagingService

        const messageOptions : MessageListInstanceCreateOptions = {
            from: messagingService,
            to: whatsappAddressTo,
        }
        if (event.template) {
            messageOptions.contentSid = event.template
            messageOptions.contentVariables = JSON.stringify(parameters)
        } else {
            messageOptions.body = event.message
        }

        await client.messages.create({
            from: messagingService,
            to: whatsappAddressTo,
            contentSid: event.template,
            contentVariables: JSON.stringify(parameters)
        })

        callback(null, 'OK')
    } catch (error) {
        console.log(error)
        callback('ERROR')
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