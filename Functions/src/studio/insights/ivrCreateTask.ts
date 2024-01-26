import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { WorkspaceContextImpl } from "twilio/lib/rest/taskrouter/v1/workspace";

type MyContext = {
    TASK_ROUTER_WORKSPACE_SID: string
    TASK_ROUTER_NOBODY_WORKFLOW_SID: string
}

type MyEvent = {
    from: string
    callSid: string
    flowSid: string
}

type ConversationsObject = {
    [key: string]: any
}

export const handler = (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) => {
    
    let timestamp = new Date()
    const { from, callSid, flowSid } = event

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
    conversations.conversation_attribute_3 = flowSid;
    conversations.conversation_label_3 = "Flow Sid";
    client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
            attributes: JSON.stringify({ "from": from, twilio_call_sid: callSid, conversations }),
            workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
            timeout: 300
        }).then(() => {
            callback(null);
        })
}