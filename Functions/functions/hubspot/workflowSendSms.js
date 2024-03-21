const fetch = require("node-fetch");

exports.handler = async (context, event, callback) => {

    const authHeader = event.request.headers.authorization;
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');

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

    const phone = `${event.phone ?? ''}`
    const message = event.message ?? ''
    const messagingServiceSid = event.messagingServiceSid ?? ''
    
    if (phone === '' || message === '' || messagingServiceSid === '') {
        response.setBody({
            status: 'error',
            type: 'createMessage',
            data: 'phone, message and messagingServiceSid are required'
        })
        return callback(null, response)
    }

    const client = context.getTwilioClient()

    try {
        const result = await client.messages
            .create({
                body: message,
                messagingServiceSid: messagingServiceSid,
                to: phone
            }).then(() => {
                return {
                    status: 'success',
                    type: 'createMessage',
                    data: 'Message sent'
                }
            }).catch((error) => {
                return {
                    status: 'error',
                    type: 'createMessage',
                    data: error
                }
            })

        response.setBody(result)
    } catch (error) {
        response.setBody({
            status: 'error',
            type: 'createMessage',
            data: error
        })
        console.log(error)
    }

    callback(null, response)
}

const setUnauthorized = (response) => {
    response
        .setBody({
            status: 'error',
            type: 'createMessage',
            data: 'Unauthorized'
        })
        .setStatusCode(401)
        .appendHeader(
            'WWW-Authenticate',
            'Basic realm="Authentication Required"'
        );

    return response;
};