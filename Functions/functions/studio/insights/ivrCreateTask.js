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
    conversations.communication_channel = "IVR";
    conversations.IVR_time_start = timestamp.getTime();
    client.taskrouter.v1
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks.create({
        attributes: JSON.stringify({ "from": from, conversations: conversations }),
        workflowSid: context.TWILIO_NOBODY_WORKFLOW_SID,
        timeout: 300
    }).then(function () {
        callback(null);
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZyQ3JlYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvaXZyQ3JlYXRlVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFnQk8sSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCO0lBRzVCLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7SUFDbEIsSUFBQSxJQUFJLEdBQWMsS0FBSyxLQUFuQixFQUFFLE9BQU8sR0FBSyxLQUFLLFFBQVYsQ0FBVTtJQUUvQixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDeEMsSUFBTSxhQUFhLEdBQXdCLEVBQUUsQ0FBQTtJQUM3QyxhQUFhLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztJQUN4QyxhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM5QixhQUFhLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUNoQyxhQUFhLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUN0QyxhQUFhLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO0lBQzVDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRW5ELE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRTtTQUNmLFVBQVUsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUM7U0FDeEMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNWLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLGVBQUEsRUFBRSxDQUFDO1FBQzNELFdBQVcsRUFBRSxPQUFPLENBQUMsMEJBQTBCO1FBQy9DLE9BQU8sRUFBRSxHQUFHO0tBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNKLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQTtBQUNWLENBQUMsQ0FBQTtBQTNCWSxRQUFBLE9BQU8sV0EyQm5CIn0=