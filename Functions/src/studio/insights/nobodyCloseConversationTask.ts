import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types"


type MyContext = {
    TASK_ROUTER_WORKSPACE_SID: string
}

type MyEvent = {
    abandoned?: string
    conversationSid: string
}

export const handler = async (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) => {

    const { abandoned, conversationSid } = event

    const client = context.getTwilioClient()

    const taskFilter = `conversations.conversation_id == '${conversationSid}'`

    await client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks
        .list({ evaluateTaskAttributes: taskFilter })
        .then(async (tasks) => {
            const taskSid = tasks[0].sid;
            const attributes = { ...JSON.parse(tasks[0].attributes) };

            //was the call abandoned?
            if (abandoned === "true") {
                attributes.conversations.abandoned = "Yes";
                attributes.conversations.abandoned_phase = "BOT";
            } else {
                attributes.conversations.abandoned = "No";
                attributes.conversations.abandoned_phase = null;
            }

            //update the task
            await client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                .tasks(taskSid)
                .update({
                    assignmentStatus: 'canceled',
                    reason: 'Bot Task',
                    attributes: JSON.stringify(attributes)
                })
                .then(task => {
                    callback(null);
                })
                .catch(error => {
                    console.log(error);
                    callback(error);
                });
        })
        .catch(error => {
            console.log(error)
            callback(error)
        })
}