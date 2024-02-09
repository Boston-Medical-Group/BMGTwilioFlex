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
    var IVR_end = (new Date()).getTime();
    var callStatus = event.callStatus, digits = event.digits, callSid = event.callSid;
    var client = context.getTwilioClient();
    var taskFilter = "conversations.conversation_id == '".concat(callSid, "'");
    client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
        .tasks
        .list({ evaluateTaskAttributes: taskFilter })
        .then(function (tasks) {
        var taskSid = tasks[0].sid;
        var attributes = __assign({}, JSON.parse(tasks[0].attributes));
        var IVR_time = Math.round((IVR_end - attributes.conversations.IVR_time_start) / 1000);
        attributes.conversations.queue_time = 0;
        attributes.conversations.ivr_path = digits;
        attributes.conversations.ivr_time = IVR_time;
        //was the call abandoned?
        if (callStatus !== "completed") {
            attributes.conversations.abandoned = "Yes";
            attributes.conversations.abandoned_phase = "IVR";
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
            reason: 'IVR task',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZyVXBkYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvaXZyVXBkYXRlVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQWFPLElBQU0sT0FBTyxHQUFHLFVBQ25CLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0QjtJQUc1QixJQUFNLE9BQU8sR0FBWSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUN2QyxJQUFBLFVBQVUsR0FBc0IsS0FBSyxXQUEzQixFQUFFLE1BQU0sR0FBYyxLQUFLLE9BQW5CLEVBQUUsT0FBTyxHQUFLLEtBQUssUUFBVixDQUFVO0lBRTdDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUV4QyxJQUFNLFVBQVUsR0FBRyw0Q0FBcUMsT0FBTyxNQUFHLENBQUE7SUFFbEUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztTQUM3RCxLQUFLO1NBQ0wsSUFBSSxDQUFDLEVBQUUsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLENBQUM7U0FDNUMsSUFBSSxDQUFDLFVBQUEsS0FBSztRQUNQLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDN0IsSUFBTSxVQUFVLGdCQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFFLENBQUM7UUFDMUQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRXhGLFVBQVUsQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUV4QyxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDM0MsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRTdDLHlCQUF5QjtRQUN6QixJQUFJLFVBQVUsS0FBSyxXQUFXLEVBQUUsQ0FBQztZQUM3QixVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDM0MsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3JELENBQUM7YUFBTSxDQUFDO1lBQ0osVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQzFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNwRCxDQUFDO1FBRUQsaUJBQWlCO1FBQ2pCLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUM7YUFDN0QsS0FBSyxDQUFDLE9BQU8sQ0FBQzthQUNkLE1BQU0sQ0FBQztZQUNKLGdCQUFnQixFQUFFLFVBQVU7WUFDNUIsTUFBTSxFQUFFLFVBQVU7WUFDbEIsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1NBQ3pDLENBQUM7YUFDRCxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ04sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25CLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxVQUFBLEtBQUs7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxVQUFBLEtBQUs7UUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2xCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNuQixDQUFDLENBQUMsQ0FBQTtBQUNWLENBQUMsQ0FBQTtBQXZEWSxRQUFBLE9BQU8sV0F1RG5CIn0=