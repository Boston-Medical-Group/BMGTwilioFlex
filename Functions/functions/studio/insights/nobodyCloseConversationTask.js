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
exports.handler = void 0;
var handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var abandoned, conversationSid, client, taskFilter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                abandoned = event.abandoned, conversationSid = event.conversationSid;
                client = context.getTwilioClient();
                taskFilter = "conversations.conversation_id == '".concat(conversationSid, "'");
                return [4 /*yield*/, client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                        .tasks
                        .list({ evaluateTaskAttributes: taskFilter })
                        .then(function (tasks) { return __awaiter(void 0, void 0, void 0, function () {
                        var taskSid, attributes;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(tasks.length > 0)) return [3 /*break*/, 2];
                                    taskSid = tasks[0].sid;
                                    attributes = __assign({}, JSON.parse(tasks[0].attributes));
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
                                    return [4 /*yield*/, client.taskrouter.v1.workspaces(context.TASK_ROUTER_WORKSPACE_SID)
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
                                        })];
                                case 1:
                                    //update the task
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    callback(null);
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        console.log(error);
                        callback(error);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ib2R5Q2xvc2VDb252ZXJzYXRpb25UYXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0dWRpby9pbnNpZ2h0cy9ub2JvZHlDbG9zZUNvbnZlcnNhdGlvblRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZTyxJQUFNLE9BQU8sR0FBRyxVQUNuQixPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7O2dCQUdwQixTQUFTLEdBQXNCLEtBQUssVUFBM0IsRUFBRSxlQUFlLEdBQUssS0FBSyxnQkFBVixDQUFVO2dCQUV0QyxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFBO2dCQUVsQyxVQUFVLEdBQUcsNENBQXFDLGVBQWUsTUFBRyxDQUFBO2dCQUUxRSxxQkFBTSxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDO3lCQUNuRSxLQUFLO3lCQUNMLElBQUksQ0FBQyxFQUFFLHNCQUFzQixFQUFFLFVBQVUsRUFBRSxDQUFDO3lCQUM1QyxJQUFJLENBQUMsVUFBTyxLQUFLOzs7Ozt5Q0FDVixDQUFBLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEVBQWhCLHdCQUFnQjtvQ0FHVixPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQ0FDdkIsVUFBVSxnQkFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBRSxDQUFDO29DQUUxRCx5QkFBeUI7b0NBQ3pCLElBQUksU0FBUyxLQUFLLE1BQU0sRUFBRTt3Q0FDdEIsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO3dDQUMzQyxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7cUNBQ3BEO3lDQUFNO3dDQUNILFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzt3Q0FDMUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO3FDQUNuRDtvQ0FFRCxpQkFBaUI7b0NBQ2pCLHFCQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUM7NkNBQ25FLEtBQUssQ0FBQyxPQUFPLENBQUM7NkNBQ2QsTUFBTSxDQUFDOzRDQUNKLGdCQUFnQixFQUFFLFVBQVU7NENBQzVCLE1BQU0sRUFBRSxVQUFVOzRDQUNsQixVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7eUNBQ3pDLENBQUM7NkNBQ0QsSUFBSSxDQUFDLFVBQUEsSUFBSTs0Q0FDTixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7d0NBQ25CLENBQUMsQ0FBQzs2Q0FDRCxLQUFLLENBQUMsVUFBQSxLQUFLOzRDQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7NENBQ25CLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3Q0FDcEIsQ0FBQyxDQUFDLEVBQUE7O29DQWROLGlCQUFpQjtvQ0FDakIsU0FhTSxDQUFDOzs7b0NBRVAsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozt5QkFFdEIsQ0FBQzt5QkFDRCxLQUFLLENBQUMsVUFBQSxLQUFLO3dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7d0JBQ2xCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDbkIsQ0FBQyxDQUFDLEVBQUE7O2dCQXpDTixTQXlDTSxDQUFBOzs7O0tBQ1QsQ0FBQTtBQXREWSxRQUFBLE9BQU8sV0FzRG5CIn0=