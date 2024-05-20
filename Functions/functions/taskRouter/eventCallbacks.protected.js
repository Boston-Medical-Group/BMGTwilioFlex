"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TaskRouterEventTypes represents all possible values from event type of
 * all TaskRouter's events.
 */
var TaskRouterEventTypes;
(function (TaskRouterEventTypes) {
    /* Task Events */
    TaskRouterEventTypes["taskCreated"] = "task.created";
    TaskRouterEventTypes["taskUpdated"] = "task.updated";
    TaskRouterEventTypes["taskCanceled"] = "task.canceled";
    TaskRouterEventTypes["taskWrapup"] = "task.wrapup";
    TaskRouterEventTypes["taskCompleted"] = "task.completed";
    TaskRouterEventTypes["taskDeleted"] = "task.deleted";
    TaskRouterEventTypes["taskSystemDeleted"] = "task.system-deleted";
    /* Reservation Events */
    TaskRouterEventTypes["reservationCreated"] = "reservation.created";
    TaskRouterEventTypes["reservationAccepted"] = "reservation.accepted";
    TaskRouterEventTypes["reservationRejected"] = "reservation.rejected";
    TaskRouterEventTypes["reservationTimeout"] = "reservation.timeout";
    TaskRouterEventTypes["reservationCanceled"] = "reservation.canceled";
    TaskRouterEventTypes["reservationRescinded"] = "reservation.rescinded";
    TaskRouterEventTypes["reservationCompleted"] = "reservation.completed";
    /* Task Queue Events */
    TaskRouterEventTypes["taskQueueCreated"] = "task-queue.created";
    TaskRouterEventTypes["taskQueueDeleted"] = "task-queue.deleted";
    TaskRouterEventTypes["taskQueueEntered"] = "task-queue.entered";
    TaskRouterEventTypes["taskQueueTimeout"] = "task-queue.timeout";
    TaskRouterEventTypes["taskQueueMoved"] = "task-queue.moved";
    /* Workflow Events */
    TaskRouterEventTypes["workflowTargetMatched"] = "workflow.target-matched";
    TaskRouterEventTypes["workflowEntered"] = "workflow.entered";
    TaskRouterEventTypes["workflowTimeout"] = "workflow.timeout";
    TaskRouterEventTypes["workflowSkipped"] = "workflow.skipped";
    /* Worker Events */
    TaskRouterEventTypes["workerCreated"] = "worker.created";
    TaskRouterEventTypes["workerActivityUpdate"] = "worker.activity.update";
    TaskRouterEventTypes["workerAttributesUpdate"] = "worker.attributes.update";
    TaskRouterEventTypes["workerCapacityUpdate"] = "worker.capacity.update";
    TaskRouterEventTypes["workerChannelAvailabilityUpdate"] = "worker.channel.availability.update";
    TaskRouterEventTypes["workerDeleted"] = "worker.deleted";
})(TaskRouterEventTypes || (TaskRouterEventTypes = {}));
/**
 * Checks if a event is a task related event or not
 *
 * @param type the Event to be checked
 */
var isTaskEvent = function (event) {
    return event.EventType && event.EventType.startsWith('task.');
};
exports.handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var client, attributes, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!isTaskEvent(event)) {
                    callback(null, {});
                }
                client = context.getTwilioClient();
                console.log('EVENTTYPE ' + event.EventType);
                if (!(event.EventType === 'task.deleted' || event.EventType == 'task.completed')) return [3 /*break*/, 6];
                attributes = JSON.parse((_a = event.TaskAttributes) !== null && _a !== void 0 ? _a : '{}');
                console.log('CONVERSATIONSID ' + attributes.conversationSid);
                if (!attributes.conversationSid) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.conversations.v1.conversations(attributes.conversationSid).update({ state: "closed" })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                console.log('NOT SID');
                _b.label = 6;
            case 6:
                callback(null, {});
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRDYWxsYmFja3MucHJvdGVjdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rhc2tSb3V0ZXIvZXZlbnRDYWxsYmFja3MucHJvdGVjdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUE7OztHQUdHO0FBQ0gsSUFBSyxvQkFtQ0o7QUFuQ0QsV0FBSyxvQkFBb0I7SUFDckIsaUJBQWlCO0lBQ2pCLG9EQUE0QixDQUFBO0lBQzVCLG9EQUE0QixDQUFBO0lBQzVCLHNEQUE4QixDQUFBO0lBQzlCLGtEQUEwQixDQUFBO0lBQzFCLHdEQUFnQyxDQUFBO0lBQ2hDLG9EQUE0QixDQUFBO0lBQzVCLGlFQUF5QyxDQUFBO0lBQ3pDLHdCQUF3QjtJQUN4QixrRUFBMEMsQ0FBQTtJQUMxQyxvRUFBNEMsQ0FBQTtJQUM1QyxvRUFBNEMsQ0FBQTtJQUM1QyxrRUFBMEMsQ0FBQTtJQUMxQyxvRUFBNEMsQ0FBQTtJQUM1QyxzRUFBOEMsQ0FBQTtJQUM5QyxzRUFBOEMsQ0FBQTtJQUM5Qyx1QkFBdUI7SUFDdkIsK0RBQXVDLENBQUE7SUFDdkMsK0RBQXVDLENBQUE7SUFDdkMsK0RBQXVDLENBQUE7SUFDdkMsK0RBQXVDLENBQUE7SUFDdkMsMkRBQW1DLENBQUE7SUFDbkMscUJBQXFCO0lBQ3JCLHlFQUFpRCxDQUFBO0lBQ2pELDREQUFvQyxDQUFBO0lBQ3BDLDREQUFvQyxDQUFBO0lBQ3BDLDREQUFvQyxDQUFBO0lBQ3BDLG1CQUFtQjtJQUNuQix3REFBZ0MsQ0FBQTtJQUNoQyx1RUFBK0MsQ0FBQTtJQUMvQywyRUFBbUQsQ0FBQTtJQUNuRCx1RUFBK0MsQ0FBQTtJQUMvQyw4RkFBc0UsQ0FBQTtJQUN0RSx3REFBZ0MsQ0FBQTtBQUNwQyxDQUFDLEVBbkNJLG9CQUFvQixLQUFwQixvQkFBb0IsUUFtQ3hCO0FBb0VEOzs7O0dBSUc7QUFDSCxJQUFNLFdBQVcsR0FBRyxVQUFDLEtBQXNCO0lBQ3ZDLE9BQUEsS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7QUFBdEQsQ0FBc0QsQ0FBQztBQUczRCxPQUFPLENBQUMsT0FBTyxHQUFHLFVBQ2QsT0FBMkIsRUFDM0IsS0FBc0IsRUFDdEIsUUFBNEI7Ozs7OztnQkFFNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDckIsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztpQkFDdEI7Z0JBRUssTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO3FCQUN2QyxDQUFBLEtBQUssQ0FBQyxTQUFTLEtBQUssY0FBYyxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksZ0JBQWdCLENBQUEsRUFBekUsd0JBQXlFO2dCQUVuRSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFBLEtBQUssQ0FBQyxjQUFjLG1DQUFJLElBQUksQ0FBQyxDQUFDO2dCQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQTtxQkFDeEQsVUFBVSxDQUFDLGVBQWUsRUFBMUIsd0JBQTBCOzs7O2dCQUV0QixxQkFBTSxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFBOztnQkFBbkcsU0FBbUcsQ0FBQzs7OztnQkFFcEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLENBQUMsQ0FBQzs7OztnQkFHdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O2dCQUkvQixRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7O0tBQ3RCLENBQUEifQ==