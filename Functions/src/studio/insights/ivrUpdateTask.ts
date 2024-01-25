import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types"


type MyContext = {
    TASK_ROUTER_WORKSPACE_SID: string
}

type MyEvent = {
    callStatus: string
    digits: any
    callSid: string
}

export const handler = (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) => {

    const IVR_end : number = (new Date()).getTime()
    const { callStatus, digits, callSid } = event

    const client = context.getTwilioClient()

    const taskFilter = `conversations.conversation_id == '${callSid}'`

    client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks
        .list({ evaluateTaskAttributes: taskFilter })
        .then(tasks => {
            const taskSid = tasks[0].sid;
            const attributes = { ...JSON.parse(tasks[0].attributes) };
            const IVR_time = Math.round((IVR_end - attributes.conversations.IVR_time_start) / 1000);

            attributes.conversations.queue_time = 0;

            attributes.conversations.ivr_path = digits;
            attributes.conversations.ivr_time = IVR_time;

            //was the call abandoned?
            if (callStatus == "completed") {
                attributes.conversations.abandoned = "Yes";
                attributes.conversations.abandoned_phase = "IVR";
            } else {
                attributes.conversations.abandoned = "No";
                attributes.conversations.abandoned_phase = null;
            }

            //update the task
            client.taskrouter.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                .tasks(taskSid)
                .update({
                    assignmentStatus: 'canceled',
                    reason: 'IVR task',
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