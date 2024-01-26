"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var handler = function (context, event, callback) {
    var timestamp = new Date();
    var from = event.from, callSid = event.callSid, flowSid = event.flowSid;
    var client = context.getTwilioClient();
    var conversations = {};
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
        attributes: JSON.stringify({ "from": from, twilio_call_sid: callSid, conversations: conversations }),
        workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
        timeout: 300
    }).then(function () {
        callback(null);
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZyQ3JlYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvaXZyQ3JlYXRlVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFrQk8sSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCO0lBRzVCLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7SUFDbEIsSUFBQSxJQUFJLEdBQXVCLEtBQUssS0FBNUIsRUFBRSxPQUFPLEdBQWMsS0FBSyxRQUFuQixFQUFFLE9BQU8sR0FBSyxLQUFLLFFBQVYsQ0FBVTtJQUV4QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDeEMsSUFBTSxhQUFhLEdBQXdCLEVBQUUsQ0FBQTtJQUM3QyxhQUFhLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQztJQUN4QyxhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM5QixhQUFhLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUNoQyxhQUFhLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUN0QyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUMzQixhQUFhLENBQUMscUJBQXFCLEdBQUcsT0FBTyxDQUFDO0lBQzlDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25ELGFBQWEsQ0FBQyx3QkFBd0IsR0FBRyxPQUFPLENBQUM7SUFDakQsYUFBYSxDQUFDLG9CQUFvQixHQUFHLFVBQVUsQ0FBQztJQUNoRCxhQUFhLENBQUMsd0JBQXdCLEdBQUcsT0FBTyxDQUFDO0lBQ2pELGFBQWEsQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLENBQUM7SUFDaEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1NBQ2YsVUFBVSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztTQUM3QyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ1YsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsYUFBYSxlQUFBLEVBQUUsQ0FBQztRQUNyRixXQUFXLEVBQUUsT0FBTyxDQUFDLCtCQUErQjtRQUNwRCxPQUFPLEVBQUUsR0FBRztLQUNmLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDSixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUE7QUFDVixDQUFDLENBQUE7QUEvQlksUUFBQSxPQUFPLFdBK0JuQiJ9