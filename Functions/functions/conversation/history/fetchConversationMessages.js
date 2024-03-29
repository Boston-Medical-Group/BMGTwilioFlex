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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("@twilio-labs/serverless-runtime-types");
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
var MAX_MESSAGES_TO_FETCH = 20;
/* Returns the messages within a given conversation */
var getConversationMessages = function (client, conversationSid) { return __awaiter(void 0, void 0, void 0, function () {
    var result, messages, _a, messages_1, messages_1_1, message, media, msg, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                result = [];
                return [4 /*yield*/, client.conversations.v1.conversations(conversationSid)
                        .messages
                        .list({ limit: MAX_MESSAGES_TO_FETCH })
                    //create a result object with the information we want to supply
                ];
            case 1:
                messages = _e.sent();
                _e.label = 2;
            case 2:
                _e.trys.push([2, 7, 8, 13]);
                _a = true, messages_1 = __asyncValues(messages);
                _e.label = 3;
            case 3: return [4 /*yield*/, messages_1.next()];
            case 4:
                if (!(messages_1_1 = _e.sent(), _b = messages_1_1.done, !_b)) return [3 /*break*/, 6];
                _d = messages_1_1.value;
                _a = false;
                message = _d;
                media = JSON.stringify(message.media);
                console.log('ADDINGMESSaGESID', message.sid);
                try {
                    msg = JSON.parse("{\n                \"index\": \"".concat(message.index, "\",\n                \"author\": \"").concat(message.author, "\", \n                \"body\": \"").concat(message.body, "\",\n                \"media\": ").concat(media, ",\n                \"dateCreated\": \"").concat(message.dateCreated, "\"\n                }"));
                    result.push(msg);
                }
                catch (e) {
                    console.log('ADDINGMESSAGEERROR', e);
                }
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
                if (!(!_a && !_b && (_c = messages_1.return))) return [3 /*break*/, 10];
                return [4 /*yield*/, _c.call(messages_1)];
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
        var client, response, conversationSid, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = context.getTwilioClient();
                    response = new Twilio.Response();
                    // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
                    response.appendHeader('Access-Control-Allow-Origin', '*');
                    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
                    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
                    response.appendHeader('Content-Type', 'application/json');
                    conversationSid = event.conversationSid;
                    //validate if a conversationSid has been provided
                    if (!conversationSid) {
                        response.setBody(JSON.parse("{\"error\": \"no conversationSid provided\"}"));
                        response.setStatusCode(200);
                        callback(null, response);
                    }
                    return [4 /*yield*/, getConversationMessages(client, conversationSid).then(function (resp) {
                            // handle success 
                            var data = resp;
                            if (typeof data !== 'undefined') {
                                response.setBody(data);
                            }
                            else {
                                response.setBody(JSON.parse("{\"result\": \"error\"}"));
                            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hDb252ZXJzYXRpb25NZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb252ZXJzYXRpb24vaGlzdG9yeS9mZXRjaENvbnZlcnNhdGlvbk1lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBK0M7QUFFL0MsMkVBQWtGO0FBR2xGLElBQU0scUJBQXFCLEdBQUcsRUFBRSxDQUFDO0FBRWpDLHNEQUFzRDtBQUN0RCxJQUFNLHVCQUF1QixHQUFHLFVBQU8sTUFBcUIsRUFBRSxlQUF1Qjs7Ozs7O2dCQUM3RSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztnQkFDTSxxQkFBTSxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDO3lCQUMxRixRQUFRO3lCQUNSLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxDQUFDO29CQUUzQywrREFBK0Q7a0JBRnBCOztnQkFGdkMsUUFBUSxHQUF1QixTQUVROzs7OzJCQUdmLGFBQUEsY0FBQSxRQUFRLENBQUE7Ozs7O2dCQUFSLHdCQUFRO2dCQUFSLFdBQVE7Z0JBQW5CLE9BQU8sS0FBQSxDQUFBO2dCQUVoQixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUM1QyxJQUFJO29CQUNJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLDBDQUNMLE9BQU8sQ0FBQyxLQUFLLGdEQUNaLE9BQU8sQ0FBQyxNQUFNLCtDQUNoQixPQUFPLENBQUMsSUFBSSw2Q0FDWixLQUFLLG1EQUNFLE9BQU8sQ0FBQyxXQUFXLDBCQUNuQyxDQUFDLENBQUM7b0JBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDcEI7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQTtpQkFDbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBRVQsc0JBQU8sTUFBTSxFQUFDOzs7S0FDakIsQ0FBQTtBQU1ELFlBQVk7QUFDQyxRQUFBLE9BQU8sR0FBRyxJQUFBLCtDQUFjLEVBQUMsVUFDbEMsT0FBZ0IsRUFDaEIsS0FBYyxFQUNkLFFBQTRCOzs7Ozs7b0JBR3RCLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBSW5DLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFFdkMseUZBQXlGO29CQUN6RixRQUFRLENBQUMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMxRCxRQUFRLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQzFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBQ3RFLFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBRXRELGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO29CQUU1QyxpREFBaUQ7b0JBQ2pELElBQUksQ0FBQyxlQUFlLEVBQUU7d0JBQ2xCLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyw4Q0FBMEMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pFLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzVCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQzVCO29CQUdlLHFCQUFNLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJOzRCQUN0RixrQkFBa0I7NEJBQ2xCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs0QkFDaEIsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLEVBQUU7Z0NBQzdCLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7NkJBQzFCO2lDQUFNO2dDQUNILFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBcUIsQ0FBQyxDQUFDLENBQUM7NkJBQ3ZEOzRCQUVELFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQzVCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQzdCLENBQUMsQ0FBQyxFQUFBOztvQkFYSSxPQUFPLEdBQUcsU0FXZDs7Ozs7Q0FDTCxDQUFDLENBQUMifQ==