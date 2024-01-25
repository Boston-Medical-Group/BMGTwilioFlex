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
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var response, client, threadMessages, openai, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = new Twilio.Response();
                response.appendHeader("Access-Control-Allow-Origin", "*");
                response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                response.appendHeader("Content-Type", "application/json");
                if (!event.conversation_sid) {
                    response.setStatusCode(404);
                    response.setBody({});
                    callback(null, response);
                }
                client = context.getTwilioClient();
                threadMessages = [];
                //Obtiene los mensajes de la conversacion
                return [4 /*yield*/, client.conversations.v1.conversations(event.conversation_sid).messages.list({
                        limit: 20,
                        order: 'desc'
                    }).then(function (messages) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            messages.map(function (message) {
                                threadMessages.push({
                                    role: "user",
                                    content: message.body
                                });
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            case 1:
                //Obtiene los mensajes de la conversacion
                _a.sent();
                openai = new openai_1.default({ apiKey: context.OPENAI_API_KEY });
                return [4 /*yield*/, openai.beta.threads.create({
                        messages: threadMessages
                    }).then(function (thread) { return __awaiter(void 0, void 0, void 0, function () {
                        var run;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, openai.beta.threads.runs.create(thread.id, {
                                        assistant_id: context.OPENAI_ASSITANT_ID
                                    })
                                        .then(function (run) { return (run); })
                                        .catch(function (error) {
                                        console.log(error);
                                        return null;
                                    })];
                                case 1:
                                    run = _a.sent();
                                    return [2 /*return*/, {
                                            thread_id: thread.id,
                                            run_id: run === null || run === void 0 ? void 0 : run.id
                                        }];
                            }
                        });
                    }); }).catch(function (error) {
                        console.error(error);
                        return null;
                    })];
            case 2:
                result = _a.sent();
                if (!result) {
                    console.log('NO RUN FOUND');
                    response.setStatusCode(400);
                    response.setBody({});
                    callback(null, response);
                }
                else {
                    response.setStatusCode(200);
                    response.setBody(result);
                    callback(null, response);
                }
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWFkUnVuQ3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FpL3RocmVhZFJ1bkNyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBNEI7QUFDNUIsMkVBQWdFO0FBaUJoRSxZQUFZO0FBQ0MsUUFBQSxPQUFPLEdBQUcsSUFBQSwrQ0FBaUIsRUFBQyxVQUNyQyxPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7O2dCQUV0QixRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZDLFFBQVEsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzFELFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDMUUsUUFBUSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDdEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFFMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDekIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDM0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQkFDcEIsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtpQkFDM0I7Z0JBRUssTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQTtnQkFDbEMsY0FBYyxHQUE4QyxFQUFFLENBQUE7Z0JBQ3BFLHlDQUF5QztnQkFDekMscUJBQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQzlFLEtBQUssRUFBRSxFQUFFO3dCQUNULEtBQUssRUFBRSxNQUFNO3FCQUNoQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQU8sUUFBUTs7NEJBQ25CLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxPQUFPO2dDQUNqQixjQUFjLENBQUMsSUFBSSxDQUFDO29DQUNoQixJQUFJLEVBQUUsTUFBTTtvQ0FDWixPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUk7aUNBQ3hCLENBQUMsQ0FBQTs0QkFDTixDQUFDLENBQUMsQ0FBQTs7O3lCQUNMLENBQUMsRUFBQTs7Z0JBWEYseUNBQXlDO2dCQUN6QyxTQVVFLENBQUE7Z0JBR0ksTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFDaEMscUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUMzRCxRQUFRLEVBQUUsY0FBYztxQkFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFNLE1BQU07Ozs7d0NBQ0oscUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO3dDQUN6RCxZQUFZLEVBQUUsT0FBTyxDQUFDLGtCQUFrQjtxQ0FDM0MsQ0FBQzt5Q0FDRyxJQUFJLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxFQUFMLENBQUssQ0FBQzt5Q0FDcEIsS0FBSyxDQUFDLFVBQUMsS0FBSzt3Q0FDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO3dDQUNsQixPQUFPLElBQUksQ0FBQTtvQ0FDZixDQUFDLENBQUMsRUFBQTs7b0NBUEEsR0FBRyxHQUFHLFNBT047b0NBRU4sc0JBQU87NENBQ0gsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFFOzRDQUNwQixNQUFNLEVBQUUsR0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEVBQUU7eUNBQ2xCLEVBQUE7Ozt5QkFDSixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsS0FBSzt3QkFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUNwQixPQUFPLElBQUksQ0FBQTtvQkFDZixDQUFDLENBQUMsRUFBQTs7Z0JBbkJJLE1BQU0sR0FBa0IsU0FtQjVCO2dCQUVGLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtvQkFDM0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDM0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQkFDcEIsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtpQkFDM0I7cUJBQU07b0JBQ0gsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDM0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDeEIsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtpQkFDM0I7Ozs7S0FDSixDQUFDLENBQUEifQ==