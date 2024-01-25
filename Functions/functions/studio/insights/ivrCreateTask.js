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
    client.taskrouter
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZyQ3JlYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvaXZyQ3JlYXRlVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFnQk8sSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCO0lBRzVCLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7SUFDbEIsSUFBQSxJQUFJLEdBQWMsS0FBSyxLQUFuQixFQUFFLE9BQU8sR0FBSyxLQUFLLFFBQVYsQ0FBVTtJQUUvQixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDeEMsSUFBTSxhQUFhLEdBQXdCLEVBQUUsQ0FBQTtJQUM3QyxhQUFhLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztJQUN4QyxhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM5QixhQUFhLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUNoQyxhQUFhLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUN0QyxhQUFhLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO0lBQzVDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRW5ELE1BQU0sQ0FBQyxVQUFVO1NBQ1osVUFBVSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztTQUN4QyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ1YsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsZUFBQSxFQUFFLENBQUM7UUFDM0QsV0FBVyxFQUFFLE9BQU8sQ0FBQywwQkFBMEI7UUFDL0MsT0FBTyxFQUFFLEdBQUc7S0FDZixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ0osUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0FBQ1YsQ0FBQyxDQUFBO0FBM0JZLFFBQUEsT0FBTyxXQTJCbkIifQ==