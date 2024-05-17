import '@twilio-labs/serverless-runtime-types';
import { Context } from '@twilio-labs/serverless-runtime-types/types';
import { Callback, functionValidator as FunctionTokenValidator, validator as TokenValidator } from 'twilio-flex-token-validator'
import * as twilio from 'twilio';
import { ParticipantConversationInstance } from 'twilio/lib/rest/conversations/v1/participantConversation';
import { ConversationInstance } from 'twilio/lib/rest/conversations/v1/conversation';

export type HubspotContact = {
    firstname?: string
    lastname?: string
    phone?: string
    hs_object_id?: string
    email?: string
    reservar_cita?: string
    [key: string]: any
}


const getActiveConversation = async (client : twilio.Twilio, to : string) : Promise<ConversationInstance | false> => {
    const participantConversations = await client.conversations.v1.participantConversations.list({
        limit: 100,
        pageSize: 100,
        address: to
    })

    // Find first participantConversation with state active
    const participantConversation = participantConversations.find((participantConversation: ParticipantConversationInstance) => participantConversation.conversationState === 'active')
    if (participantConversation) {
        return await client.conversations.v1.conversations(participantConversation.conversationSid).fetch();
    }
    
    return false;
}

const openAChatTask = async (
    client: twilio.Twilio,
    To: string,
    customerName: string,
    From: string,
    WorkerConversationIdentity: string,
    channel: any,
    hubspotContact: HubspotContact,
    hubspot_contact_id: string,
    hubspot_deal_id: string,
    routingProperties: any
) => {

    const conversation = await getActiveConversation(client, To);
    let conversationSid;
    // Ya tiene una conversación activa
    if (conversation) {
        const participants = await conversation.participants().list()
        // Si tiene más de un participante, significa que tiene una interacción con otro o el mismo agente
        if (participants.length > 1) {
            // Verificar si el agente ya es participante de esta conversación
            const agent = participants.find((participant) => participant.identity === WorkerConversationIdentity)
            // Si está interactuando con otro agente
            if (!agent) {
                return {
                    success: false,
                    errorMessage: 'ALREADY_ACTIVE_CONVERSATION_WITH_ANOTHER_AGENT'
                };
            } else {
                // Si está interactuando con el mismo agente
                return {
                    success: false,
                    errorMessage: 'ALREADY_ACTIVE_CONVERSATION_WITH_AGENT'
                };
            }
        } else {
            // Conversación huerfana, notificar
            return {
                success: false,
                errorMessage: 'ALREADY_ACTIVE_CONVERSATION_WITHOUT_AGENT'
            };
            // @todo debería reactivar la conversación con el agente actual
            /*
            await client.conversations.v1.conversations(conversation.sid).participants.create({
                identity: WorkerConversationIdentity
            })
            conversationSid = conversation.sid
            */
            
        }
    }


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
            xTwilioWebhookEnabled: true,
            friendlyName: `Outbound: ${From} -> ${To}`,
        },
        routing: {
            properties: {
                ...routingProperties,
                task_channel_unique_name: channel === 'whatsapp' ? 'chat' : channel,
                attributes: {
                    //conversationSid,
                    hubspotContact,
                    xTwilioWebhookEnabled: true,
                    name: customerName,
                    hubspot_contact_id,
                    hubspot_deal_id,
                    from: To, // todo From debería ser el agente y debería enviar To como destinatario (contacto)
                    direction: "outbound",
                    customerName: customerName,
                    customerAddress: To,
                    twilioNumber: From,
                    channelType: channel,
                    customers: {
                        external_id: hubspotContact.hs_object_id || null,
                        phone: hubspotContact.phone || null,
                        email: hubspotContact.email || null
                    }
                },
            },
        }
    });

    const taskAttributes = JSON.parse(interaction.routing.properties.attributes);

    return {
        success: true,
        interactionSid: interaction.sid,
        conversationSid: taskAttributes.conversationSid
    };
};

type MyEvent = {
    To: string
    Body: string
    customerName: string
    hubspot_contact_id: string
    hubspot_deal_id: string
    WorkerFriendlyName: string
    hubspotContact: object
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
        customerName,
        hubspotContact,
        hubspot_contact_id,
        hubspot_deal_id,
        WorkerFriendlyName,
        Token
    } = event;

    let { OpenChatFlag, KnownAgentRoutingFlag } = event;

    const channel = To.includes('whatsapp') ? 'whatsapp' : 'sms';
    const From = channel === 'whatsapp' ? `whatsapp:${context.TWILIO_WA_PHONE_NUMBER}` : context.TWILIO_PHONE_NUMBER;
    const client = context.getTwilioClient();

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

    
        // create task and add the message to a channel
        sendResponse = await openAChatTask(
            //@ts-ignore
            client,
            To,
            customerName,
            From,
            identity,
            channel,
            hubspotContact,
            hubspot_contact_id,
            hubspot_deal_id,
            {
                workspace_sid: context.TASK_ROUTER_WORKSPACE_SID,
                workflow_sid: context.TASK_ROUTER_WORKFLOW_SID,
                queue_sid: context.FLEX_APP_OUTBOUND_WHATSAPP_QUEUE_SID,
                worker_sid: worker_sid
            }
        );

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