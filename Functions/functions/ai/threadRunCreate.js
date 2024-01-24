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
var handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var response, client, threadId, openai, run;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = new Twilio.Response();
                response.appendHeader("Access-Control-Allow-Origin", "*");
                response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                response.setStatusCode(200);
                if (!event.conversation_sid) {
                    response.setStatusCode(404);
                    response.setBody({});
                    callback(null, response);
                }
                client = context.getTwilioClient();
                return [4 /*yield*/, client.conversations.v1.conversations(event.conversation_sid).fetch()
                        .then(function (conversation) { return __awaiter(void 0, void 0, void 0, function () {
                        var conversationAttributes;
                        return __generator(this, function (_a) {
                            conversationAttributes = JSON.parse(conversation.attributes);
                            if (!conversationAttributes.thread_id) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, conversationAttributes.thread_id];
                        });
                    }); }).catch(function (error) {
                        console.log(error);
                        return null;
                    })];
            case 1:
                threadId = _a.sent();
                if (!threadId || threadId === null) {
                    response.setStatusCode(404);
                    response.setBody({});
                    callback(null, response);
                }
                openai = new openai_1.default({ apiKey: context.OPENAI_API_KEY });
                return [4 /*yield*/, openai.beta.threads.runs.create(threadId, {
                        assistant_id: context.OPENAI_ASSITANT_ID
                    })
                        .then(function (run) { return (run); })
                        .catch(function (error) {
                        console.log(error);
                        return null;
                    })];
            case 2:
                run = _a.sent();
                if (!run || run === null) {
                    console.log('NO RUN FOUND');
                    response.setStatusCode(400);
                    response.setBody({});
                    callback(null, response);
                }
                else {
                    response.setBody(run);
                    callback(null, response);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWFkUnVuQ3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FpL3RocmVhZFJ1bkNyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBNEI7QUFnQnJCLElBQU0sT0FBTyxHQUFHLFVBQ25CLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0Qjs7Ozs7Z0JBRXRCLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdkMsUUFBUSxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDMUQsUUFBUSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMxRSxRQUFRLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUN0RSxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUUzQixJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFO29CQUN6QixRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUMzQixRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUNwQixRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO2lCQUMzQjtnQkFFSyxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFBO2dCQUNQLHFCQUFNLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLEVBQUU7eUJBQ3ZHLElBQUksQ0FBQyxVQUFPLFlBQVk7Ozs0QkFDZixzQkFBc0IsR0FBMkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7NEJBQzFGLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUU7Z0NBQ25DLHNCQUFPLElBQUksRUFBQTs2QkFDZDs0QkFFRCxzQkFBTyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUE7O3lCQUMxQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsS0FBSzt3QkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUNsQixPQUFPLElBQUksQ0FBQTtvQkFDZixDQUFDLENBQUMsRUFBQTs7Z0JBWEEsUUFBUSxHQUFtQixTQVczQjtnQkFFTixJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7b0JBQ2hDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBQzNCLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7b0JBQ3BCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7aUJBQzNCO2dCQUVLLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xELHFCQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQzdDLFFBQWtCLEVBQ2xCO3dCQUNJLFlBQVksRUFBRSxPQUFPLENBQUMsa0JBQWtCO3FCQUMzQyxDQUNKO3lCQUNJLElBQUksQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLEVBQUwsQ0FBSyxDQUFDO3lCQUNwQixLQUFLLENBQUMsVUFBQyxLQUFLO3dCQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7d0JBQ2xCLE9BQU8sSUFBSSxDQUFBO29CQUNmLENBQUMsQ0FBQyxFQUFBOztnQkFWQSxHQUFHLEdBQUcsU0FVTjtnQkFFTixJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7b0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7b0JBQzNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBQzNCLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7b0JBQ3BCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7aUJBQzNCO3FCQUFNO29CQUNILFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBQ3JCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7aUJBQzNCOzs7O0tBQ0osQ0FBQTtBQTNEWSxRQUFBLE9BQU8sV0EyRG5CIn0=