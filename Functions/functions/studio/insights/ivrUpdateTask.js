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
    client.taskrouter.workspaces(context.TWILIO_WORKSPACE_SID)
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
        if (callStatus == "completed") {
            attributes.conversations.abandoned = "Yes";
            attributes.conversations.abandoned_phase = "IVR";
        }
        else {
            attributes.conversations.abandoned = "No";
            attributes.conversations.abandoned_phase = null;
        }
        //update the task
        client.taskrouter.workspaces(context.TWILIO_WORKSPACE_SID)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZyVXBkYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaW5zaWdodHMvaXZyVXBkYXRlVGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQWFPLElBQU0sT0FBTyxHQUFHLFVBQ25CLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0QjtJQUc1QixJQUFNLE9BQU8sR0FBWSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUN2QyxJQUFBLFVBQVUsR0FBc0IsS0FBSyxXQUEzQixFQUFFLE1BQU0sR0FBYyxLQUFLLE9BQW5CLEVBQUUsT0FBTyxHQUFLLEtBQUssUUFBVixDQUFVO0lBRTdDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUV4QyxJQUFNLFVBQVUsR0FBRyw0Q0FBcUMsT0FBTyxNQUFHLENBQUE7SUFFbEUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1NBQ3JELEtBQUs7U0FDTCxJQUFJLENBQUMsRUFBRSxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsQ0FBQztTQUM1QyxJQUFJLENBQUMsVUFBQSxLQUFLO1FBQ1AsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUM3QixJQUFNLFVBQVUsZ0JBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUUsQ0FBQztRQUMxRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFeEYsVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXhDLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUMzQyxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFN0MseUJBQXlCO1FBQ3pCLElBQUksVUFBVSxJQUFJLFdBQVcsRUFBRTtZQUMzQixVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDM0MsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1NBQ3BEO2FBQU07WUFDSCxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDMUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQ25EO1FBRUQsaUJBQWlCO1FBQ2pCLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQzthQUNyRCxLQUFLLENBQUMsT0FBTyxDQUFDO2FBQ2QsTUFBTSxDQUFDO1lBQ0osZ0JBQWdCLEVBQUUsVUFBVTtZQUM1QixNQUFNLEVBQUUsVUFBVTtZQUNsQixVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7U0FDekMsQ0FBQzthQUNELElBQUksQ0FBQyxVQUFBLElBQUk7WUFDTixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLFVBQUEsS0FBSztZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxDQUFDO1NBQ0QsS0FBSyxDQUFDLFVBQUEsS0FBSztRQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0FBQ1YsQ0FBQyxDQUFBO0FBdkRZLFFBQUEsT0FBTyxXQXVEbkIifQ==