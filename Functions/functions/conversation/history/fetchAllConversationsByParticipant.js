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
/* Fetches all conversations by a participant.
* The participant is either a phone number i.e. +447123123123 or a whatsapp:++447123123123 and then we bundle them together
* If the participant is a chat participant, the chat is being tied to a from address //TODO MODIFIED FROM?
*/
var MAX_CONVERSATIONS_TO_FETCH = 100;
var MAX_CONVERSATIONS_TO_PRESENT = 20;
var MAX_PERIOD = 12;
/* Returns previous date */
function getPreviousDate(monthsAgo) {
    var d = new Date(); // Current date
    d.setMonth(d.getMonth() - monthsAgo);
    return d;
}
/* Returns the conversations list in order.
** Applies filter startDate > date, where date is at a maximum the MAX_PERIOD */
function getAllConversationsList(client, fromAddress) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var newDate, result, fromAddressWA, conversationsListNumber, conversationsListWA, conversationsList, _d, conversationsList_1, conversationsList_1_1, conversation, originalChannel, convo, e_1_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    newDate = MAX_PERIOD;
                    result = [];
                    //if the original fromAddress is a WhatsApp we need to swap it around
                    if (fromAddress.startsWith('whatsapp:')) {
                        fromAddressWA = fromAddress;
                        fromAddress = fromAddress.slice(9);
                    }
                    fromAddressWA = 'whatsapp:' + fromAddress;
                    return [4 /*yield*/, client
                            .conversations
                            .v1
                            .participantConversations
                            .list({ address: fromAddress, limit: MAX_CONVERSATIONS_TO_FETCH })
                        //fetch conversations with filters
                    ];
                case 1:
                    conversationsListNumber = _e.sent();
                    return [4 /*yield*/, client
                            .conversations
                            .v1
                            .participantConversations
                            .list({ address: fromAddressWA, limit: MAX_CONVERSATIONS_TO_FETCH })
                        //sort by date created 
                    ];
                case 2:
                    conversationsListWA = _e.sent();
                    conversationsList = conversationsListNumber.concat(conversationsListWA);
                    //@ts-ignore
                    conversationsList.sort(function (a, b) { return new Date(b.conversationDateCreated) - new Date(a.conversationDateCreated); });
                    //remove those that are not to be presented
                    if (MAX_CONVERSATIONS_TO_FETCH > MAX_CONVERSATIONS_TO_PRESENT) {
                        conversationsList
                            .splice(MAX_CONVERSATIONS_TO_PRESENT, MAX_CONVERSATIONS_TO_FETCH - MAX_CONVERSATIONS_TO_PRESENT);
                    }
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 8, 9, 14]);
                    _d = true, conversationsList_1 = __asyncValues(conversationsList);
                    _e.label = 4;
                case 4: return [4 /*yield*/, conversationsList_1.next()];
                case 5:
                    if (!(conversationsList_1_1 = _e.sent(), _a = conversationsList_1_1.done, !_a)) return [3 /*break*/, 7];
                    _c = conversationsList_1_1.value;
                    _d = false;
                    conversation = _c;
                    originalChannel = conversation.participantMessagingBinding.type;
                    //if the proxy comes out null, it was originally a chat
                    if (originalChannel === 'sms') {
                        if (!conversation.participantMessagingBinding.proxy_address) {
                            originalChannel = 'chat';
                        }
                    }
                    convo = JSON.parse("{\n        \"conversationOriginalChannel\": \"".concat(originalChannel, "\",\n        \"conversationSid\": \"").concat(conversation.conversationSid, "\", \n        \"conversationDateCreated\": \"").concat(conversation.conversationDateCreated, "\",\n        \"conversationState\": \"").concat(conversation.conversationState, "\",\n        \"from\": \"").concat(conversation.participantMessagingBinding.address, "\"\n        }"));
                    result.push(convo);
                    _e.label = 6;
                case 6:
                    _d = true;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _e.trys.push([9, , 12, 13]);
                    if (!(!_d && !_a && (_b = conversationsList_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _b.call(conversationsList_1)];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/, result];
            }
        });
    });
}
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
                    return [4 /*yield*/, getAllConversationsList(client, phoneNumber).then(function (resp) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hBbGxDb252ZXJzYXRpb25zQnlQYXJ0aWNpcGFudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb252ZXJzYXRpb24vaGlzdG9yeS9mZXRjaEFsbENvbnZlcnNhdGlvbnNCeVBhcnRpY2lwYW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyRUFBa0Y7QUFFbEYsa0VBQTRDO0FBRTVDOzs7RUFHRTtBQUVGLElBQU0sMEJBQTBCLEdBQUcsR0FBRyxDQUFDO0FBQ3ZDLElBQU0sNEJBQTRCLEdBQUcsRUFBRSxDQUFDO0FBQ3hDLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUV0QiwyQkFBMkI7QUFDM0IsU0FBUyxlQUFlLENBQUMsU0FBa0I7SUFDdkMsSUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWU7SUFDckMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFDckMsT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDO0FBRUQ7Z0ZBQ2dGO0FBQ2hGLFNBQWUsdUJBQXVCLENBQUMsTUFBYyxFQUFFLFdBQW1COzs7Ozs7O29CQUNsRSxPQUFPLEdBQUcsVUFBVSxDQUFDO29CQUNyQixNQUFNLEdBQUcsRUFBRSxDQUFDO29CQUVoQixxRUFBcUU7b0JBQ3JFLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTt3QkFDckMsYUFBYSxHQUFHLFdBQVcsQ0FBQzt3QkFDNUIsV0FBVyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RDO29CQUVHLGFBQWEsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUdkLHFCQUFNLE1BQU07NkJBQ3ZDLGFBQWE7NkJBQ2IsRUFBRTs2QkFDRix3QkFB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