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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var openai_1 = __importDefault(require("openai"));
var handler = function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var openai, client;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    openai = new openai_1.default({ apiKey: context.OPENAI_API_KEY });
                    client = context.getTwilioClient();
                    if (!(event.EventType === "onConversationAdded")) return [3 /*break*/, 2];
                    // Crear thread
                    return [4 /*yield*/, openai.beta.threads.create()
                            .then(function (thread) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, client.conversations.v1.conversations(event.ConversationSid).fetch()
                                            .then(function (conversation) { return __awaiter(_this, void 0, void 0, function () {
                                            var attributes;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        attributes = JSON.parse(conversation.attributes);
                                                        attributes.thread_id = thread.id;
                                                        return [4 /*yield*/, client.conversations.v1.conversations(event.ConversationSid).update({
                                                                attributes: JSON.stringify(attributes)
                                                            }).catch(function (error) {
                                                                console.log(error);
                                                            })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }).catch(function (error) {
                                            console.log(error);
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }).catch(function (error) {
                            console.log(error);
                        })];
                case 1:
                    // Crear thread
                    _a.sent();
                    callback(null, {});
                    return [3 /*break*/, 4];
                case 2:
                    if (!(event.EventType === "onMessageAdded")) return [3 /*break*/, 4];
                    // Crear mensaje
                    return [4 /*yield*/, client.conversations.v1.conversations(event.ConversationSid).fetch()
                            .then(function (conversation) { return __awaiter(_this, void 0, void 0, function () {
                            var attributes;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        attributes = JSON.parse(conversation.attributes);
                                        if (!attributes.thread_id) return [3 /*break*/, 2];
                                        return [4 /*yield*/, openai.beta.threads.messages.create(attributes.thread_id, {
                                                role: "user",
                                                content: event.Body
                                            }).catch(function (error) {
                                                console.log(error);
                                            })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    // Crear mensaje
                    _a.sent();
                    _a.label = 4;
                case 4:
                    console.log(event.ConversationSid);
                    callback(null, {});
                    return [2 /*return*/];
            }
        });
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVyc2F0aW9uc1dlYmhvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWkvY29udmVyc2F0aW9uc1dlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQTRCO0FBdUJyQixJQUFNLE9BQU8sR0FBRyxVQUNuQixPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7Ozs7b0JBSXRCLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7b0JBQ3hELE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7eUJBQ3JDLENBQUEsS0FBSyxDQUFDLFNBQVMsS0FBSyxxQkFBcUIsQ0FBQSxFQUF6Qyx3QkFBeUM7b0JBQ3pDLGVBQWU7b0JBQ2YscUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFOzZCQUM3QixJQUFJLENBQUMsVUFBTyxNQUFNOzs7OzRDQUNmLHFCQUFNLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxFQUFFOzZDQUNyRSxJQUFJLENBQUMsVUFBTyxZQUFZOzs7Ozt3REFDZixVQUFVLEdBQTRCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFBO3dEQUMvRSxVQUFVLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUE7d0RBQ2hDLHFCQUFNLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDO2dFQUN0RSxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7NkRBQ3pDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxLQUFLO2dFQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7NERBQ3RCLENBQUMsQ0FBQyxFQUFBOzt3REFKRixTQUlFLENBQUE7Ozs7NkNBQ0wsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEtBQUs7NENBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTt3Q0FDdEIsQ0FBQyxDQUFDLEVBQUE7O3dDQVhOLFNBV00sQ0FBQTs7Ozs2QkFDVCxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsS0FBSzs0QkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUN0QixDQUFDLENBQUMsRUFBQTs7b0JBakJOLGVBQWU7b0JBQ2YsU0FnQk0sQ0FBQTtvQkFFTixRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBOzs7eUJBQ1gsQ0FBQSxLQUFLLENBQUMsU0FBUyxLQUFLLGdCQUFnQixDQUFBLEVBQXBDLHdCQUFvQztvQkFDM0MsZ0JBQWdCO29CQUNoQixxQkFBTSxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssRUFBRTs2QkFDckUsSUFBSSxDQUFDLFVBQU8sWUFBWTs7Ozs7d0NBQ2YsVUFBVSxHQUE0QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTs2Q0FDM0UsVUFBVSxDQUFDLFNBQVMsRUFBcEIsd0JBQW9CO3dDQUNwQixxQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7Z0RBQzVELElBQUksRUFBRSxNQUFNO2dEQUNaLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSTs2Q0FDdEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEtBQUs7Z0RBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTs0Q0FDdEIsQ0FBQyxDQUFDLEVBQUE7O3dDQUxGLFNBS0UsQ0FBQTs7Ozs7NkJBRVQsQ0FBQyxFQUFBOztvQkFaTixnQkFBZ0I7b0JBQ2hCLFNBV00sQ0FBQTs7O29CQUdWLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO29CQUVsQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBOzs7OztDQUNyQixDQUFBO0FBakRZLFFBQUEsT0FBTyxXQWlEbkIifQ==