import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { WorkspaceContextImpl } from "twilio/lib/rest/taskrouter/v1/workspace";

type MyContext = {
    TASK_ROUTER_WORKSPACE_SID: string
    TASK_ROUTER_NOBODY_WORKFLOW_SID: string
}

type MyEvent = {
    from: string
    callSid: string
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
    const { from, callSid } = event

    const client = context.getTwilioClient()
    const conversations: ConversationsObject = {}
    conversations.conversation_id = callSid;
    conversations.virtual = "Yes";
    conversations.abandoned = "Yes";
    conversations.abandoned_phase = "IVR";
    conversations.communication_channel = "IVR";
    conversations.IVR_time_start = timestamp.getTime();
    client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
            attributes: JSON.stringify({ "from": from, conversations }),
            workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
            timeout: 300
        }).then(() => {
            callback(null);
        })
}