"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var handler = function (context, event, callback) {
    var timestamp = new Date();
    var from = event.from, callSid = event.callSid;
    var client = context.getTwilioClient();
    var conversations = {};
    conversations.conversation_id = callSid;
    conversations.virtual = "Yes";
    conversations.abandoned = "Yes";
    conversations.abandoned_phase = "IVR";
    conversations.kind = "IVR";
    conversations.communication_channel = "Call";
    conversations.IVR_time_start = timestamp.getTime();
    client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
        attributes: JSON.stringify({ "from": from, conversations: conversations }),
        workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
        timeout: 300
    }).then(function () {
        callback(null);
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZyQ3JlYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvaXZyQ3JlYXRlVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFpQk8sSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCO0lBRzVCLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7SUFDbEIsSUFBQSxJQUFJLEdBQWMsS0FBSyxLQUFuQixFQUFFLE9BQU8sR0FBSyxLQUFLLFFBQVYsQ0FBVTtJQUUvQixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDeEMsSUFBTSxhQUFhLEdBQXdCLEVBQUUsQ0FBQTtJQUM3QyxhQUFhLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztJQUN4QyxhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM5QixhQUFhLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUNoQyxhQUFhLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUN0QyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUMzQixhQUFhLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDO0lBQzdDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25ELE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRTtTQUNmLFVBQVUsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUM7U0FDN0MsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNWLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLGVBQUEsRUFBRSxDQUFDO1FBQzNELFdBQVcsRUFBRSxPQUFPLENBQUMsK0JBQStCO1FBQ3BELE9BQU8sRUFBRSxHQUFHO0tBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNKLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQTtBQUNWLENBQUMsQ0FBQTtBQTNCWSxRQUFBLE9BQU8sV0EyQm5CIn0=