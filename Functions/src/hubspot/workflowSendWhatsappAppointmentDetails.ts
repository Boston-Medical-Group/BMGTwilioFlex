import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types"
import { Client as HubspotClient } from "@hubspot/api-client";
import { AccessTokenInfoResponse } from "@hubspot/api-client/lib/codegen/oauth";

type MyContext = {
    ACCOUNT_SID: string
    AUTH_TOKEN: string
    TWILIO_WA_PHONE_NUMBER: string
    HUBSPOT_TOKEN: string
    TASK_ROUTER_WORKSPACE_SID: string
    TASK_ROUTER_NOBODY_WORKFLOW_SID: string
}

type MyEvent = {
    request: any,
    cookies: any,
    template: string
    messagingService: string
    phone: string
    customParam?: string
    [key: string] : string | undefined
}

/**
 * 
 * Available parameters:
 * - template?
 * - contactId?
 * - phone
 * - objectId?
 * - objectType?
 * - param_*?
 * - customParam?
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
    
    if (!event.hasOwnProperty('template')) {
        return callback(null, 'ERROR: Missing template');
    }

    let attributes: { [key: string]: string } = Object.keys(event)
        .filter((k) => k.indexOf('param_') != 0 && k != 'request')
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

    let returnObject: any = { 'result': 'OK' };

    try {
        const whatsappAddressTo = event.phone.indexOf('whatsapp:') === -1 ? `whatsapp:${event.phone}` : `${event.phone}`
        const whatsappAddressFrom = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? `whatsapp:${context.TWILIO_WA_PHONE_NUMBER}` : `${context.TWILIO_WA_PHONE_NUMBER}`
        const activeConversation = await getActiveConversation(context, whatsappAddressTo)
        if (activeConversation === null) {
            const timestamp = (new Date).getTime();
            await client.conversations.v1.conversations.create({
                friendlyName: `HubspotWorkflow -> ${event.phone} (${timestamp})`,
                attributes: JSON.stringify(attributes),
                timers: {
                    inactive: 'PT30M',
                    closed: 'PT1H'
                }
            }).then(async (conversation) => {
                return await client.conversations.v1.conversations(conversation.sid).participants.create({
                    //@ts-ignore
                    "messagingBinding.address": whatsappAddressTo,
                    "messagingBinding.proxyAddress": whatsappAddressFrom
                }).then(async (participant) => {
                    let msg;
                    let templateName: string = '';
                    await client.content.v1.contents(event.template)
                        .fetch()
                        .then((content) => {
                            templateName = content.friendlyName
                        })
                    
                    msg = await client.conversations.v1.conversations(conversation.sid).messages.create({
                        contentSid: event.template,
                        contentVariables: JSON.stringify(parameters)
                    })

                    await createNobodyTask({
                        context,
                        from: whatsappAddressTo,
                        conversationSid: conversation.sid,
                        flowName: event.flowName ?? 'Unknown Flow',
                        name: event.fullname,
                        leadOrPatient: event.leadOrPatient ?? '',
                        contactId: event.contactId,
                        hubspotAccountId: event.hubspotAccountId ?? undefined,
                        implementation: event.implementation ?? 'Transactional',
                        abandoned: event.abandoned ?? 'No',
                        customParam: event.customParam ?? 'nodata',
                        templateName
                    }).then(async (task) => {
                        await client.taskrouter.v1
                            .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                            .tasks
                            .get(task.sid)
                            .update({
                                assignmentStatus: 'canceled'
                            })
                        
                        await client.conversations.v1.conversations(conversation.sid).update({
                            state: 'closed'
                        })
                    })


                    returnObject = {
                        ...returnObject,
                        sid: msg.sid,
                        body: msg.body
                    }
                })
            })
        } else {
            let msg;
            let templateName: string = '';
            await client.content.v1.contents(event.template)
                .fetch()
                .then((content) => {
                    templateName = content.friendlyName
                })
            
            msg = await client.conversations.v1.conversations(activeConversation).messages.create({
                contentSid: event.template,
                contentVariables: JSON.stringify(parameters)
            })

            await createNobodyTask({
                context,
                from: whatsappAddressTo,
                conversationSid: activeConversation,
                flowName: event.flowName ?? 'Unknown Flow',
                name: event.fullname,
                leadOrPatient: event.leadOrPatient ?? '',
                contactId: event.contactId,
                hubspotAccountId: event.hubspotAccountId ?? undefined,
                implementation: event.implementation ?? 'Transactional',
                abandoned: event.abandoned ?? 'No',
                customParam: event.customParam ?? 'nodata',
                templateName
            }).then(async (task) => {
                await client.taskrouter.v1
                    .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                    .tasks
                    .get(task.sid)
                    .update({
                        assignmentStatus: 'canceled'
                    })
            })

            returnObject = {
                ...returnObject,
                sid: msg.sid,
                body: msg.body
            }
        }
    } catch (error) {
        console.log(error)
        returnObject.result = 'ERROR'
        returnObject.error = error
    }

    callback(null, returnObject)
}

const getActiveConversation = async (context: Context<MyContext>, whatsappAddressTo: string) => {
    const client = context.getTwilioClient()
    const conversations = await client.conversations.v1.participantConversations.list({
        address: whatsappAddressTo,
        limit: 50,
    });

    const activeConversation = conversations.find((conversation) => conversation.conversationState === 'active')
    if (activeConversation != undefined) {
        return activeConversation.conversationSid;
    }

    return null;
}

type ConversationsObject = {
    [key: string]: any
}

type NobodyTaskParams = {
    context: Context<MyContext>
    from: string
    conversationSid: string
    flowName?: string
    name?: string
    leadOrPatient?: string
    contactId?: string
    hubspotAccountId?: string | number
    implementation: string
    abandoned: string
    customParam: string
    templateName: string
}

type CustomersObject = {
    [key: string]: any
}

const createNobodyTask = async ({
    context,
    from,
    conversationSid,
    flowName,
    name,
    leadOrPatient,
    contactId,
    hubspotAccountId,
    implementation,
    abandoned,
    customParam,
    templateName
}: NobodyTaskParams) => {

    let appointmentTypes : { [ key: string | number ] : string } = {
        1: '1era visita',
        2: '2da visita',
        37: 'Ondas',
        50: 'ATM',
        55: 'TPS',
        61: '2da recompra',
        63: 'Urología',
        66: 'Tele_O',
        68: 'Valoración CVS',
        69: 'Valoración Psx',
        70: 'Bloqueada',
        72: 'Piso Pélvico',
        73: 'Nutrición',
        74: 'Nutrición seguimiento',
        76: 'Administrativa',
        77: 'F/R',
        78: 'Viaje',
        79: 'OOC',
        80: 'Cardiología',
        81: 'Endocrina',
        82: 'Intervención quirúrgica QX',
        83: 'PRP'
    }

    const client = context.getTwilioClient()

    const conversations: ConversationsObject = {}
    conversations.conversation_id = conversationSid;
    conversations.virtual = "Yes";
    conversations.abandoned = abandoned === "true" ? "Yes" : "No";
    conversations.abandoned_phase = "BOT";
    conversations.kind = "Bot";
    conversations.direction = "outbound";
    conversations.communication_channel = "Chat";
    conversations.conversation_label_1 = "Conversation Sid";
    conversations.conversation_attribute_1 = conversationSid;
    conversations.conversation_label_2 = "Flow Name";
    conversations.conversation_attribute_2 = flowName;
    conversations.conversation_label_3 = "Template Friendly name";
    conversations.conversation_attribute_3 = templateName;
    conversations.conversation_label_4 = "BOT implementation";
    conversations.conversation_attribute_4 = implementation;
    conversations.conversation_label_5 = "Tipo cita";
    conversations.conversation_attribute_5 = appointmentTypes.hasOwnProperty(customParam) ? appointmentTypes[customParam] : customParam;

    const customers: CustomersObject = {};
    customers.customer_label_1 = "Lead or Patient";
    customers.customer_attribute_1 = leadOrPatient;
    customers.customer_label_2 = "URL Hubspot";
    

    if (!hubspotAccountId) {
        const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
        try {
            hubspotAccountId = await hubspotClient.oauth.accessTokensApi.get(context.HUBSPOT_TOKEN)
                .then((response: AccessTokenInfoResponse) => response.hubId)
        } catch (err) {
            console.log(err)
        }
    }

    customers.customer_attribute_2 = `https://app-eu1.hubspot.com/contacts/${hubspotAccountId}/record/0-1/${contactId}`;

    return client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
            attributes: JSON.stringify({ "from": from, "name": name, conversations, customers }),
            workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
            timeout: 86400
        })
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