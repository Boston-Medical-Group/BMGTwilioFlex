const fetch = require("node-fetch");

const logDummyTask = async (context, m, options) => {
    const {
        phone,
        name,
        message,
        messagingServiceSid,
        leadOrPatient,
        hubspotContactId,
        hubspotAccountId
    } = options

    let timestamp = new Date()

    const client = context.getTwilioClient();
    let conversations = {}
    conversations.virtual = "Yes";
    conversations.communication_channel = "sms";
    let customers = {}
    customers.customer_label_1 = "Lead or Patient";
    customers.customer_attribute_1 = leadOrPatient;
    customers.customer_label_2 = "URL Hubspot";
    customers.customer_attribute_2 = `https://app-eu1.hubspot.com/contacts/${hubspotAccountId}/record/0-1/${hubspotContactId}`;
    await client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
            attributes: JSON.stringify({
                "from": phone,
                "name": name,
                conversations,
                customers
            }),
            workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
            timeout: 300
        }).then(async (t) => {
            const taskSid = t.sid;

            //update the task
            await client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                .tasks(taskSid)
                .update({
                    status: 'completed',
                    assignmentStatus: 'canceled',
                    reason: 'SMS Bulk task',
                })
                .catch(error => {
                    console.log(error);
                });
        })
}


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
    const name = `${event.name ?? ''}`
    const message = event.message ?? ''
    const leadOrPatient = event.leadOrPatient ?? 'lead'
    const hubspotContactId = event.hubspotContactId ?? ''
    const messagingServiceSid = event.messagingServiceSid ?? ''
    const hubspotAccountId = event.hubspotAccountId ?? ''
    
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
            }).then((m) => {
                logDummyTask(context, m, {
                    phone,
                    name,
                    message,
                    messagingServiceSid,
                    leadOrPatient,
                    hubspotContactId,
                    hubspotAccountId
                })

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