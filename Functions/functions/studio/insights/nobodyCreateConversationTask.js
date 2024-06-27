"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var handler = function (context, event, callback) {
    var from = event.from, conversationSid = event.conversationSid, flowSid = event.flowSid, flowName = event.flowName, name = event.name, leadOrPatient = event.leadOrPatient, contactId = event.contactId, hubspotAccountId = event.hubspotAccountId, implementation = event.implementation, abandoned = event.abandoned;
    var client = context.getTwilioClient();
    var conversations = {};
    conversations.conversation_id = conversationSid;
    conversations.virtual = "Yes";
    conversations.abandoned = abandoned === "true" ? "Yes" : "No";
    conversations.abandoned_phase = "BOT";
    conversations.kind = "Bot";
    conversations.communication_channel = "chat";
    conversations.conversation_label_1 = "Conversation Sid";
    conversations.conversation_attribute_1 = conversationSid;
    conversations.conversation_label_2 = "Flow Sid";
    conversations.conversation_attribute_2 = flowSid;
    conversations.conversation_label_2 = "Flow Name";
    conversations.conversation_attribute_2 = flowName;
    conversations.conversation_label_4 = "BOT implementation";
    conversations.conversation_attribute_4 = implementation;
    var customers = {};
    customers.customer_label_1 = "Lead or Patient";
    customers.customer_attribute_1 = leadOrPatient;
    customers.customer_label_2 = "URL Hubspot";
    customers.customer_attribute_2 = "https://app-eu1.hubspot.com/contacts/".concat(hubspotAccountId, "/record/0-1/").concat(contactId);
    client.taskrouter.v1
        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks.create({
        attributes: JSON.stringify({ "from": from, "name": name, conversations: conversations, customers: customers }),
        workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
        timeout: 1800
    }).then(function () {
        callback(null);
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ib2R5Q3JlYXRlQ29udmVyc2F0aW9uVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvbm9ib2R5Q3JlYXRlQ29udmVyc2F0aW9uVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUEyQk8sSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCO0lBR3BCLElBQUEsSUFBSSxHQUFzSCxLQUFLLEtBQTNILEVBQUUsZUFBZSxHQUFxRyxLQUFLLGdCQUExRyxFQUFFLE9BQU8sR0FBNEYsS0FBSyxRQUFqRyxFQUFFLFFBQVEsR0FBa0YsS0FBSyxTQUF2RixFQUFFLElBQUksR0FBNEUsS0FBSyxLQUFqRixFQUFFLGFBQWEsR0FBNkQsS0FBSyxjQUFsRSxFQUFFLFNBQVMsR0FBa0QsS0FBSyxVQUF2RCxFQUFFLGdCQUFnQixHQUFnQyxLQUFLLGlCQUFyQyxFQUFFLGNBQWMsR0FBZ0IsS0FBSyxlQUFyQixFQUFFLFNBQVMsR0FBSyxLQUFLLFVBQVYsQ0FBVTtJQUV2SSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDeEMsSUFBTSxhQUFhLEdBQXdCLEVBQUUsQ0FBQTtJQUM3QyxhQUFhLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztJQUNoRCxhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUM5QixhQUFhLENBQUMsU0FBUyxHQUFHLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzlELGFBQWEsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0lBQ3RDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQzNCLGFBQWEsQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUM7SUFDN0MsYUFBYSxDQUFDLG9CQUFvQixHQUFHLGtCQUFrQixDQUFDO0lBQ3hELGFBQWEsQ0FBQyx3QkFBd0IsR0FBRyxlQUFlLENBQUM7SUFDekQsYUFBYSxDQUFDLG9CQUFvQixHQUFHLFVBQVUsQ0FBQztJQUNoRCxhQUFhLENBQUMsd0JBQXdCLEdBQUcsT0FBTyxDQUFDO0lBQ2pELGFBQWEsQ0FBQyxvQkFBb0IsR0FBRyxXQUFXLENBQUM7SUFDakQsYUFBYSxDQUFDLHdCQUF3QixHQUFHLFFBQVEsQ0FBQztJQUNsRCxhQUFhLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsYUFBYSxDQUFDLHdCQUF3QixHQUFHLGNBQWMsQ0FBQztJQUV4RCxJQUFNLFNBQVMsR0FBb0IsRUFBRSxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztJQUMvQyxTQUFTLENBQUMsb0JBQW9CLEdBQUcsYUFBYSxDQUFDO0lBQy9DLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxhQUFhLENBQUM7SUFDM0MsU0FBUyxDQUFDLG9CQUFvQixHQUFHLCtDQUF3QyxnQkFBZ0IseUJBQWUsU0FBUyxDQUFFLENBQUM7SUFDcEgsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1NBQ2YsVUFBVSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztTQUM3QyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ1YsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxlQUFBLEVBQUUsU0FBUyxXQUFBLEVBQUUsQ0FBQztRQUNwRixXQUFXLEVBQUUsT0FBTyxDQUFDLCtCQUErQjtRQUNwRCxPQUFPLEVBQUUsSUFBSTtLQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ0osUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0FBQ1YsQ0FBQyxDQUFBO0FBdkNZLFFBQUEsT0FBTyxXQXVDbkIifQ==