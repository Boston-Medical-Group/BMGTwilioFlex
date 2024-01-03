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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
var Twilio_1 = __importDefault(require("twilio/lib/rest/Twilio"));
var MAX_CONVERSATIONS_TO_FETCH = 100;
var MAX_CONVERSATIONS_TO_PRESENT = 20;
var MAX_PERIOD = 12;
/* Returns the conversations list in order.
** Applies filter startDate > date, where date is at a maximum the MAX_PERIOD */
var getConversationsList = function (client, fromAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var result, conversationsList, _a, conversationsList_1, conversationsList_1_1, conversation, originalChannel, convo, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                result = [];
                return [4 /*yield*/, client
                        .conversations
                        .v1
                        .participantConversations
                        .list({ address: fromAddress, limit: MAX_CONVERSATIONS_TO_FETCH })
                    //sort by date created 
                    //@ts-ignore
                ]; //.then( convos => {console.log(convos)})
            case 1:
                conversationsList = _e.sent() //.then( convos => {console.log(convos)})
                ;
                //sort by date created 
                //@ts-ignore
                conversationsList.sort(function (a, b) { return new Date(b.conversationDateCreated) - new Date(a.conversationDateCreated); });
                //remove those that are not to be presented
                if (MAX_CONVERSATIONS_TO_FETCH > MAX_CONVERSATIONS_TO_PRESENT) {
                    conversationsList
                        .splice(MAX_CONVERSATIONS_TO_PRESENT, MAX_CONVERSATIONS_TO_FETCH - MAX_CONVERSATIONS_TO_PRESENT);
                }
                _e.label = 2;
            case 2:
                _e.trys.push([2, 7, 8, 13]);
                _a = true, conversationsList_1 = __asyncValues(conversationsList);
                _e.label = 3;
            case 3: return [4 /*yield*/, conversationsList_1.next()];
            case 4:
                if (!(conversationsList_1_1 = _e.sent(), _b = conversationsList_1_1.done, !_b)) return [3 /*break*/, 6];
                _d = conversationsList_1_1.value;
                _a = false;
                conversation = _d;
                originalChannel = conversation.participantMessagingBinding.type;
                //if the proxy comes out null, it was originally a chat
                if (originalChannel === 'sms') {
                    if (!conversation.participantMessagingBinding.proxy_address) {
                        originalChannel = 'chat';
                    }
                }
                convo = JSON.parse("{\n        \"conversationOriginalChannel\": \"".concat(originalChannel, "\",\n        \"conversationSid\": \"").concat(conversation.conversationSid, "\", \n        \"conversationDateCreated\": \"").concat(conversation.conversationDateCreated, "\",\n        \"conversationState\": \"").concat(conversation.conversationState, "\",\n        \"from\": \"").concat(conversation.participantMessagingBinding.address, "\"\n        }"));
                result.push(convo);
                _e.label = 5;
            case 5:
                _a = true;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 13];
            case 7:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 13];
            case 8:
                _e.trys.push([8, , 11, 12]);
                if (!(!_a && !_b && (_c = conversationsList_1.return))) return [3 /*break*/, 10];
                return [4 /*yield*/, _c.call(conversationsList_1)];
            case 9:
                _e.sent();
                _e.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 12: return [7 /*endfinally*/];
            case 13: return [2 /*return*/, result];
        }
    });
}); };
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var client, response, phoneNumber, startDateOffset, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = context.getTwilioClient();
                    response = new Twilio_1.default.Response();
                    phoneNumber = '';
                    startDateOffset = MAX_PERIOD;
                    // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
                    response.appendHeader('Access-Control-Allow-Origin', '*');
                    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
                    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
                    response.appendHeader('Content-Type', 'application/json');
                    //validate if a number has been provided
                    if (event.phoneNumber) {
                        phoneNumber = event.phoneNumber;
                    }
                    else {
                        response.setBody(JSON.parse("{\"error\": \"no number provided\"}"));
                        response.setStatusCode(200);
                        callback(null, response);
                    }
                    return [4 /*yield*/, getConversationsList(client, phoneNumber).then(function (resp) {
                            // handle success 
                            var data = resp;
                            if (typeof data !== 'undefined') {
                                response.setBody(data);
                            }
                            //handle error
                            else
                                response.setBody(JSON.parse("{\"result\": \"error\"}"));
                            response.setStatusCode(200);
                            callback(null, response);
                        })];
                case 1:
                    request = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hDb252ZXJzYXRpb25CeVBhcnRpY2lwYW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnZlcnNhdGlvbi9oaXN0b3J5L2ZldGNoQ29udmVyc2F0aW9uQnlQYXJ0aWNpcGFudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsMkVBQWtGO0FBQ2xGLGtFQUE0QztBQUM1QyxJQUFNLDBCQUEwQixHQUFHLEdBQUcsQ0FBQztBQUN2QyxJQUFNLDRCQUE0QixHQUFHLEVBQUUsQ0FBQztBQUN4QyxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFFdEI7Z0ZBQ2dGO0FBQ2hGLElBQU0sb0JBQW9CLEdBQUcsVUFBUSxNQUFjLEVBQUUsV0FBbUI7Ozs7OztnQkFDaEUsTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFHUSxxQkFBTSxNQUFNO3lCQUMvQixhQUFhO3lCQUNiLEVBQUU7eUJBQ0Ysd0JBQXdCO3lCQUN4QixJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSwwQkFBMEIsRUFBRSxDQUFDO29CQUV0RSx1QkFBdUI7b0JBQ3ZCLFlBQVk7a0JBSDBELENBQUEseUNBQXlDOztnQkFKM0csaUJBQWlCLEdBQUcsU0FJOEMsQ0FBQSx5Q0FBeUM7Z0JBQXpDO2dCQUV0RSx1QkFBdUI7Z0JBQ3ZCLFlBQVk7Z0JBQ1osaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxFQUF6RSxDQUF5RSxDQUFDLENBQUM7Z0JBRTVHLDJDQUEyQztnQkFDM0MsSUFBSSwwQkFBMEIsR0FBRyw0QkFBNEIsRUFBRTtvQkFDM0QsaUJBQWlCO3lC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