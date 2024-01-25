import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";

type MyContext = {
    TWILIO_WORKSPACE_SID: string
    TWILIO_NOBODY_WORKFLOW_SID: string
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

    client.taskrouter
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks.create({
            attributes: JSON.stringify({ "from": from, conversations }),
            workflowSid: context.TWILIO_NOBODY_WORKFLOW_SID,
            timeout: 300
        }).then(() => {
            callback(null);
        })
}