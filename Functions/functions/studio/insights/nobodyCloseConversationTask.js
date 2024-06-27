"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var handler = function (context, event, callback) {
    var abandoned = event.abandoned, conversationSid = event.conversationSid;
    var client = context.getTwilioClient();
    var taskFilter = "conversations.conversation_id == '".concat(conversationSid, "'");
    client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks
        .list({ evaluateTaskAttributes: taskFilter })
        .then(function (tasks) {
        var taskSid = tasks[0].sid;
        var attributes = __assign({}, JSON.parse(tasks[0].attributes));
        //was the call abandoned?
        if (abandoned === "true") {
            attributes.conversations.abandoned = "Yes";
            attributes.conversations.abandoned_phase = "BOT";
        }
        else {
            attributes.conversations.abandoned = "No";
            attributes.conversations.abandoned_phase = null;
        }
        //update the task
        client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
            .tasks(taskSid)
            .update({
            assignmentStatus: 'canceled',
            reason: 'Bot Task',
            attributes: JSON.stringify(attributes)
        })
            .then(function (task) {
            callback(null);
        })
            .catch(function (error) {
            console.log(error);
            callback(error);
        });
    })
        .catch(function (error) {
        console.log(error);
        callback(error);
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ib2R5Q2xvc2VDb252ZXJzYXRpb25UYXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0dWRpby9pbnNpZ2h0cy9ub2JvZHlDbG9zZUNvbnZlcnNhdGlvblRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFZTyxJQUFNLE9BQU8sR0FBRyxVQUNuQixPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7SUFHcEIsSUFBQSxTQUFTLEdBQXNCLEtBQUssVUFBM0IsRUFBRSxlQUFlLEdBQUssS0FBSyxnQkFBVixDQUFVO0lBRTVDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUV4QyxJQUFNLFVBQVUsR0FBRyw0Q0FBcUMsZUFBZSxNQUFHLENBQUE7SUFFMUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztTQUM3RCxLQUFLO1NBQ0wsSUFBSSxDQUFDLEVBQUUsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLENBQUM7U0FDNUMsSUFBSSxDQUFDLFVBQUEsS0FBSztRQUNQLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDN0IsSUFBTSxVQUFVLGdCQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFFLENBQUM7UUFFMUQseUJBQXlCO1FBQ3pCLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTtZQUN0QixVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDM0MsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1NBQ3BEO2FBQU07WUFDSCxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDMUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQ25EO1FBRUQsaUJBQWlCO1FBQ2pCLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUM7YUFDN0QsS0FBSyxDQUFDLE9BQU8sQ0FBQzthQUNkLE1BQU0sQ0FBQztZQUNKLGdCQUFnQixFQUFFLFVBQVU7WUFDNUIsTUFBTSxFQUFFLFVBQVU7WUFDbEIsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1NBQ3pDLENBQUM7YUFDRCxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ04sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxVQUFBLEtBQUs7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxVQUFBLEtBQUs7UUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2xCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNuQixDQUFDLENBQUMsQ0FBQTtBQUNWLENBQUMsQ0FBQTtBQWhEWSxRQUFBLE9BQU8sV0FnRG5CIn0=