"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var workspace_1 = require("twilio/lib/rest/taskrouter/v1/workspace");
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
    workspace_1.WorkspaceContextImpl;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZyQ3JlYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvaXZyQ3JlYXRlVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxRUFBK0U7QUFnQnhFLElBQU0sT0FBTyxHQUFHLFVBQ25CLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0QjtJQUc1QixJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0lBQ2xCLElBQUEsSUFBSSxHQUFjLEtBQUssS0FBbkIsRUFBRSxPQUFPLEdBQUssS0FBSyxRQUFWLENBQVU7SUFFL0IsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFBO0lBQ3hDLElBQU0sYUFBYSxHQUF3QixFQUFFLENBQUE7SUFDN0MsYUFBYSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7SUFDeEMsYUFBYSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDOUIsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDaEMsYUFBYSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDdEMsYUFBYSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUM1QyxhQUFhLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN2RCxnQ0FBb0IsQ0FBQTtJQUNoQixNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUU7U0FDZixVQUFVLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDO1NBQzdDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDVixVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxlQUFBLEVBQUUsQ0FBQztRQUMzRCxXQUFXLEVBQUUsT0FBTyxDQUFDLCtCQUErQjtRQUNwRCxPQUFPLEVBQUUsR0FBRztLQUNmLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDSixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUE7QUFDVixDQUFDLENBQUE7QUEzQlksUUFBQSxPQUFPLFdBMkJuQiJ9