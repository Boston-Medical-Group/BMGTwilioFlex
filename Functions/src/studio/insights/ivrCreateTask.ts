import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { WorkspaceContextImpl } from "twilio/lib/rest/taskrouter/v1/workspace";

type MyContext = {
    TASK_ROUTER_WORKSPACE_SID: string
    TASK_ROUTER_NOBODY_WORKFLOW_SID: string
}

type MyEvent = {
    name: string
    from: string
    callSid: string
    flowSid: string
    leadOrPatient: string
    contact_id: string
    hubspot_account_id: string
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
    
    let timestamp = new Date()
    const { from, callSid, flowSid, name, leadOrPatient, contact_id, hubspot_account_id } = event

    const client = context.getTwilioClient()
    const conversations: ConversationsObject = {}
    conversations.conversation_id = callSid;
    conversations.virtual = "Yes";
    conversations.abandoned = "Yes";
    conversations.abandoned_phase = "IVR";
    conversations.kind = "IVR";
    conversations.communication_channel = "voice";
    conversations.IVR_time_start = timestamp.getTime();
    conversations.conversation_attribute_1 = callSid;
    conversations.conversation_label_1 = "Call Sid";
    conversations.conversation_label_2 = "Flow Sid";
    conversations.conversation_attribute_2 = flowSid;
    const customers: CustomersObject = {};
    customers.customer_label_1 = "Lead or Patient";
    customers.customer_attribute_1 = leadOrPatient;
    customers.customer_label_2 = "URL Hubspot";
    customers.customer_attribute_2 = `https://app-eu1.hubspot.com/contacts/${hubspot_account_id}/record/0-1/${contact_id}`;
    client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
            attributes: JSON.stringify({ "from": from, "name": name, twilio_call_sid: callSid, conversations, customers }),
            workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
            timeout: 300
        }).then(() => {
            callback(null);
        })
}