"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var handler = function (context, event, callback) {
    var timestamp = new Date();
    var from = event.from, callSid = event.callSid, flowSid = event.flowSid, name = event.name, leadOrPatient = event.leadOrPatient, contact_id = event.contact_id, hubspot_account_id = event.hubspot_account_id;
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
    conversations.conversation_label_2 = "Flow Sid";
    conversations.conversation_attribute_2 = flowSid;
    var customers = {};
    customers.customer_label_1 = "Lead or Patient";
    customers.customer_attribute_1 = leadOrPatient;
    customers.customer_label_2 = "URL Hubspot";
    customers.customer_attribute_2 = "https://app-eu1.hubspot.com/contacts/".concat(hubspot_account_id, "/record/0-1/").concat(contact_id);
    client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
        attributes: JSON.stringify({ "from": from, "name": name, twilio_call_sid: callSid, conversations: conversations, customers: customers }),
        workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
        timeout: 300
    }).then(function () {
        callback(null);
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZyQ3JlYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvaXZyQ3JlYXRlVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF5Qk8sSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCO0lBRzVCLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7SUFDbEIsSUFBQSxJQUFJLEdBQTRFLEtBQUssS0FBakYsRUFBRSxPQUFPLEdBQW1FLEtBQUssUUFBeEUsRUFBRSxPQUFPLEdBQTBELEtBQUssUUFBL0QsRUFBRSxJQUFJLEdBQW9ELEtBQUssS0FBekQsRUFBRSxhQUFhLEdBQXFDLEtBQUssY0FBMUMsRUFBRSxVQUFVLEdBQXlCLEtBQUssV0FBOUIsRUFBRSxrQkFBa0IsR0FBSyxLQUFLLG1CQUFWLENBQVU7SUFFN0YsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFBO0lBQ3hDLElBQU0sYUFBYSxHQUF3QixFQUFFLENBQUE7SUFDN0MsYUFBYSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7SUFDeEMsYUFBYSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDOUIsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDaEMsYUFBYSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDdEMsYUFBYSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDM0IsYUFBYSxDQUFDLHFCQUFxQixHQUFHLE9BQU8sQ0FBQztJQUM5QyxhQUFhLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuRCxhQUFhLENBQUMsd0JBQXdCLEdBQUcsT0FBTyxDQUFDO0lBQ2pELGFBQWEsQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLENBQUM7SUFDaEQsYUFBYSxDQUFDLG9CQUFvQixHQUFHLFVBQVUsQ0FBQztJQUNoRCxhQUFhLENBQUMsd0JBQXdCLEdBQUcsT0FBTyxDQUFDO0lBQ2pELElBQU0sU0FBUyxHQUFvQixFQUFFLENBQUM7SUFDdEMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDO0lBQy9DLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxhQUFhLENBQUM7SUFDL0MsU0FBUyxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQztJQUMzQyxTQUFTLENBQUMsb0JBQW9CLEdBQUcsK0NBQXdDLGtCQUFrQix5QkFBZSxVQUFVLENBQUUsQ0FBQztJQUN2SCxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUU7U0FDZixVQUFVLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDO1NBQzdDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDVixVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLGFBQWEsZUFBQSxFQUFFLFNBQVMsV0FBQSxFQUFFLENBQUM7UUFDOUcsV0FBVyxFQUFFLE9BQU8sQ0FBQywrQkFBK0I7UUFDcEQsT0FBTyxFQUFFLEdBQUc7S0FDZixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ0osUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0FBQ1YsQ0FBQyxDQUFBO0FBcENZLFFBQUEsT0FBTyxXQW9DbkIifQ==