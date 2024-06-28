import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";

type MyContext = {
    TASK_ROUTER_WORKSPACE_SID: string
    TASK_ROUTER_NOBODY_WORKFLOW_SID: string
}

type MyEvent = {
    name: string
    from: string
    conversationSid: string
    flowSid: string
    flowName: string
    leadOrPatient: string
    contactId: string
    hubspotAccountId: string
    implementation?: string
    abandoned?: string
}

type ConversationsObject = {
    [key: string]: any
}
type CustomersObject = {
    [key: string]: any
}

export const handler = (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) => {
    
    const { from, conversationSid, flowSid, flowName, name, leadOrPatient, contactId, hubspotAccountId, implementation, abandoned } = event

    const client = context.getTwilioClient()
    const conversations: ConversationsObject = {}
    conversations.conversation_id = conversationSid;
    conversations.virtual = "Yes";
    conversations.abandoned = abandoned === "true" ? "Yes" : "No";
    conversations.abandoned_phase = "BOT";
    conversations.kind = "Bot";
    conversations.communication_channel = "Chat";
    conversations.conversation_label_1 = "Conversation Sid";
    conversations.conversation_attribute_1 = conversationSid;
    conversations.conversation_label_2 = "Flow Sid";
    conversations.conversation_attribute_2 = flowSid;
    conversations.conversation_label_2 = "Flow Name";
    conversations.conversation_attribute_2 = flowName;
    conversations.conversation_label_4 = "BOT implementation";
    conversations.conversation_attribute_4 = implementation;
    
    const customers: CustomersObject = {};
    customers.customer_label_1 = "Lead or Patient";
    customers.customer_attribute_1 = leadOrPatient;
    customers.customer_label_2 = "URL Hubspot";
    customers.customer_attribute_2 = `https://app-eu1.hubspot.com/contacts/${hubspotAccountId}/record/0-1/${contactId}`;
    client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
            attributes: JSON.stringify({ "from": from, "name": name, conversations, customers }),
            workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
            timeout: 1800 // 24 horas
        }).then(() => {
            callback(null);
        })
}