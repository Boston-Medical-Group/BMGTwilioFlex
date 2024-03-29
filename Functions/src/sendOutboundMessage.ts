import '@twilio-labs/serverless-runtime-types';
import { Context } from '@twilio-labs/serverless-runtime-types/types';
import { Callback, functionValidator as FunctionTokenValidator, validator as TokenValidator } from 'twilio-flex-token-validator'
import * as twilio from 'twilio';

const openAChatTask = async (
    client: twilio.Twilio,
    To: string,
    customerName: string,
    From: string,
    Body: string,
    WorkerConversationIdentity: string,
    channel: any,
    hubspot_contact_id: string,
    hubspot_deal_id: string,
    routingProperties: any
) => {

    const interaction = await client.flexApi.v1.interaction.create({
        channel: {
            type: channel,
            initiated_by: "agent",
            participants: [
                {
                    address: To,
                    proxy_address: From,
                },
            ],
        },
        routing: {
            properties: {
                ...routingProperties,
                task_channel_unique_name: channel === 'whatsapp' ? 'chat' : channel,
                attributes: {
                    name: customerName,
                    hubspot_contact_id,
                    hubspot_deal_id,
                    from: To,
                    direction: "outbound",
                    customerName: customerName,
                    customerAddress: To,
                    twilioNumber: From,
                    channelType: channel
                },
            },
        }
    });

    const taskAttributes = JSON.parse(interaction.routing.properties.attributes);

    /*
    const messageDelivery = await client.conversations
        .v1
        .conversations(taskAttributes.conversationSid)
        .messages.create({ author: WorkerConversationIdentity, body: Body })
        .then(async message => {
            // wait 1 second before the next statement
            return await new Promise(resolve => setTimeout(resolve, 5000)).then(async () => {
                return await message.deliveryReceipts().list({ limit: 1, pageSize: 1 })
                    .then(async (deliveryReceipts) => {
                        if (deliveryReceipts.length === 0) {
                            await client.flexApi.v1
                            return 0
                        }

                        if (deliveryReceipts[0].errorCode === 63016) {
                            return 63016
                        }

                        return 0
                    })
                    .catch(err => err)
            });
            
        })
        .catch(err => err);
        */
    
    //console.log('MESSAGESENT', messageDelivery)

    return {
        //result: messageDelivery,
        success: true, // todo usar resultado de messageDelivery
        interactionSid: interaction.sid,
        conversationSid: taskAttributes.conversationSid
    };
};

const sendOutboundMessage = async (
    //@ts-ignore
    client: Twilio,
    To: string, 
    From: string, 
    Body: string, 
    KnownAgentRoutingFlag: boolean, 
    WorkerFriendlyName: string, 
    WorkerConversationIdentity: string, 
    studioFlowSid: string
) => {
    const friendlyName = `Outbound ${From} -> ${To}`;

    // Set flag in channel attribtues so Studio knows if it should set task attribute to target known agent
    let converstationAttributes: {
        KnownAgentRoutingFlag?: boolean;
        KnownAgentWorkerFriendlyName?: string;
    } = { KnownAgentRoutingFlag };
    if (KnownAgentRoutingFlag)
        converstationAttributes.KnownAgentWorkerFriendlyName = WorkerFriendlyName;

    const attributes = JSON.stringify(converstationAttributes);

    // Create Channel
    const channel = await client.conversations.v1.conversations.create({
        friendlyName,
        attributes
    });

    // Add customer to channel
    await client.conversations
        .v1
        .conversations(channel.sid)
        .participants.create({
            'messagingBinding.address': To,
            'messagingBinding.proxyAddress': From
        });

    // Point the channel to Studio
    await client.conversations
        .v1
        .conversations(channel.sid)
        .webhooks.create({
            target: "studio",
            "configuration.flowSid": studioFlowSid,
        });

    console.log('ADDING AGENT');
    // Add agents initial message
    await client.conversations
        .v1
        .conversations(channel.sid)
        .messages.create({ author: WorkerConversationIdentity, body: Body });

    return { success: true, channelSid: channel.sid };
};

type MyEvent = {
    To: string
    Body: string
    customerName: string
    hubspot_contact_id: string
    hubspot_deal_id: string
    WorkerFriendlyName: string
    Token: string
    OpenChatFlag: boolean
    KnownAgentRoutingFlag: boolean
}

type MyContext = {
    TWILIO_PHONE_NUMBER: string
    TWILIO_WA_PHONE_NUMBER: string
    ACCOUNT_SID: string
    AUTH_TOKEN: string
    TASK_ROUTER_WORKSPACE_SID: string
    TASK_ROUTER_WORKFLOW_SID: string
    TASK_ROUTER_QUEUE_SID: string
    FLEX_APP_OUTBOUND_WHATSAPP_QUEUE_SID: string
    INBOUND_SMS_STUDIO_FLOW: string
}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: Callback
) {
    const {
        To,
        Body,
        customerName,
        hubspot_contact_id,
        hubspot_deal_id,
        WorkerFriendlyName,
        Token
    } = event;

    let { OpenChatFlag, KnownAgentRoutingFlag } = event;

    const channel = To.includes('whatsapp') ? 'whatsapp' : 'sms';
    const From = channel === 'whatsapp' ? `whatsapp:${context.TWILIO_WA_PHONE_NUMBER}` : context.TWILIO_PHONE_NUMBER;
    const client = context.getTwilioClient();

    console.log(`To : ${To}`);
    console.log(`From : ${From}`);

    // Create a custom Twilio Response
    // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
    //@ts-ignore
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    try {
        let sendResponse = null;

        //@ts-ignore
        const tokenInformation : {worker_sid: string, identity: string} = await TokenValidator(Token, context.ACCOUNT_SID || '', context.AUTH_TOKEN || '');

        const {
            worker_sid,
            identity
        } = tokenInformation;

        if (OpenChatFlag) {
            // create task and add the message to a channel
            sendResponse = await openAChatTask(
                //@ts-ignore
                client,
                To,
                customerName,
                From,
                Body,
                identity,
                channel,
                hubspot_contact_id,
                hubspot_deal_id,
                {
                    workspace_sid: context.TASK_ROUTER_WORKSPACE_SID,
                    workflow_sid: context.TASK_ROUTER_WORKFLOW_SID,
                    queue_sid: context.FLEX_APP_OUTBOUND_WHATSAPP_QUEUE_SID,
                    worker_sid: worker_sid
                }
            );
        } else {
            // create a channel but wait until customer replies before creating a task
            sendResponse = await sendOutboundMessage(
                client,
                To,
                From,
                Body,
                KnownAgentRoutingFlag,
                WorkerFriendlyName,
                identity,
                context.INBOUND_SMS_STUDIO_FLOW
            );

        }

        response.appendHeader("Content-Type", "application/json");
        response.setBody(sendResponse);
        // Return a success response using the callback function.
    } catch (err) {
        if (err instanceof Error) {
            response.appendHeader("Content-Type", "plain/text");
            response.setBody(err.message);
            response.setStatusCode(500);
            // If there's an error, send an error response
            // Keep using the response object for CORS purposes
            
        } else {
            response.setBody({});
        }
    }

    callback(null, response);
});