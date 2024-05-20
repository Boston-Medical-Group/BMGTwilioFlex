import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import * as twilio from 'twilio';
import { MessageInstance } from "twilio/lib/rest/conversations/v1/conversation/message";

type MyContext = {

}

/**
 * TaskRouterEventTypes represents all possible values from event type of
 * all TaskRouter's events.
 */
enum TaskRouterEventTypes {
    /* Task Events */
    taskCreated = 'task.created',
    taskUpdated = 'task.updated',
    taskCanceled = 'task.canceled',
    taskWrapup = 'task.wrapup',
    taskCompleted = 'task.completed',
    taskDeleted = 'task.deleted',
    taskSystemDeleted = 'task.system-deleted',
    /* Reservation Events */
    reservationCreated = 'reservation.created',
    reservationAccepted = 'reservation.accepted',
    reservationRejected = 'reservation.rejected',
    reservationTimeout = 'reservation.timeout',
    reservationCanceled = 'reservation.canceled',
    reservationRescinded = 'reservation.rescinded',
    reservationCompleted = 'reservation.completed',
    /* Task Queue Events */
    taskQueueCreated = 'task-queue.created',
    taskQueueDeleted = 'task-queue.deleted',
    taskQueueEntered = 'task-queue.entered',
    taskQueueTimeout = 'task-queue.timeout',
    taskQueueMoved = 'task-queue.moved',
    /* Workflow Events */
    workflowTargetMatched = 'workflow.target-matched',
    workflowEntered = 'workflow.entered',
    workflowTimeout = 'workflow.timeout',
    workflowSkipped = 'workflow.skipped',
    /* Worker Events */
    workerCreated = 'worker.created',
    workerActivityUpdate = 'worker.activity.update',
    workerAttributesUpdate = 'worker.attributes.update',
    workerCapacityUpdate = 'worker.capacity.update',
    workerChannelAvailabilityUpdate = 'worker.channel.availability.update',
    workerDeleted = 'worker.deleted',
}

/**
 * TaskEventFields defines the properties that will be present on the triggered event
 * when it's related to a TaskRouter's `Task`.
 */
interface TaskEventFields {
    TaskSid?: string;
    TaskAttributes?: string;
    TaskAge?: string;
    TaskPriority?: string;
    TaskAssignmentStatus?: string;
    TaskCanceledReason?: string;
    TaskCompletedReason?: string;
}
/**
 * WorkerEventFields defines the properties that will be present on the event
 * when it's related to a TaskRouter's `Worker`.
 */
interface WorkerEventFields {
    WorkerSid?: string;
    WorkerName?: string;
    WorkerAttributes?: string;
    WorkerActivitySid?: string;
    WorkerActivityName?: string;
    /* Worker's activity changing fields */
    WorkerTimeInPreviousActivity?: string;
    WorkerTimeInPreviousActivityMs?: string;
    WorkerPreviousActivitySid?: string;
    WorkerPreviousActivityName?: string;
    /* Worker's configured channel capacity/availability changing fields */
    WorkerChannelAvailable?: string;
    WorkerChannelAvailableCapacity?: string;
    WorkerChannelPreviousCapacity?: string;
    TaskChannelSid?: string;
    TaskChannelUniqueName?: string;
    WorkerChannelTaskCount?: string;
}

/**
 * TaskQueueFields defines the properties that will be present on the event
 * when it's related to a TaskRouter's `TaskQueue`.
 */
interface TaskQueueFields {
    TaskQueueSid?: string;
    TaskQueueName?: string;
    TaskQueueExpression?: string;
}

/**
 * TaskRouterEvent defines the structure of an event that is emitted by
 * the TaskRouter events callback.
 *
 * @extends TaskEventFields,WorkerEventFields,TaskQueueFields
 */
interface TaskRouterEvent extends TaskEventFields, WorkerEventFields, TaskQueueFields {
    Sid: string;
    EventType: TaskRouterEventTypes;
    AccountSid: string;
    WorkspaceSid: string;
    WorkspaceName: string;
    EventDescription: string;
    ResourceType: 'task' | 'reservation' | 'worker';
    ResourceSid: string;
    Timestamp: string | number;
    TimestampMs: string | number;
}

/**
 * Checks if a event is a task related event or not
 *
 * @param type the Event to be checked
 */
const isTaskEvent = (event: TaskRouterEvent): boolean =>
    event.EventType && event.EventType.startsWith('task.');


exports.handler = async (
    context: Context<MyContext>,
    event: TaskRouterEvent,
    callback: ServerlessCallback
) => {
    if (!isTaskEvent(event)) {
        callback(null, {});
    }

    const client = context.getTwilioClient();
    console.log('EVENTTYPE ' + event.EventType)
    if (event.EventType === 'task.deleted' || event.EventType == 'task.completed') {
        // Cierra conversaciones para evitar huerfanos
        const attributes = JSON.parse(event.TaskAttributes ?? '{}');
        console.log('CONVERSATIONSID ' + attributes.conversationSid)
        if (attributes.conversationSid) {
            try {
                await client.conversations.v1.conversations(attributes.conversationSid).update({ state: "closed" });
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('NOT SID');
        }
    }

    callback(null, {});
}