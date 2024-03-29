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
exports.handler = void 0;
/* This function is used to add a participant to a conversation before we close it,
* so that the live chat session can be surfaced on the previous chat conversations
*/
require("@twilio-labs/serverless-runtime-types");
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
//adds a messaging binding address (phone number) to an existing conversation
//@ts-ignore
function addParticipant(client, conversationSid, address) {
    return __awaiter(this, void 0, void 0, function () {
        var addParticipant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //need to check if this is a phone number, otherwise we might invoke this with a chat identity 
                    if (!address.startsWith('+')) {
                        console.log("the address (phone number) provided does not start with a +. Address provided: ", address);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, client.conversations.v1.conversations(conversationSid)
                            .participants
                            .create({
                            "messagingBinding.address": address
                        })
                            .then(function (participant) { return console.log(participant.sid); })];
                case 1:
                    addParticipant = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (
//export const handler: ServerlessFunctionSignature = async function (
context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var client, response, conversationSid, address, request;
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
                    address = event.address;
                    //validate if parameters are missing
                    if (!conversationSid || !address) {
                        response.setBody(JSON.parse("{\"error\": \"malformed request\"}"));
                        response.setStatusCode(200);
                        callback(null, response);
                    }
                    return [4 /*yield*/, addParticipant(client, conversationSid, address).then(function (resp) {
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
//};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUGFydGljaXBhbnRUb0NvbnZlcnNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb252ZXJzYXRpb24vaGlzdG9yeS9hZGRQYXJ0aWNpcGFudFRvQ29udmVyc2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztFQUVFO0FBQ0YsaURBQStDO0FBRS9DLDJFQUEwSDtBQUkxSCw2RUFBNkU7QUFDN0UsWUFBWTtBQUNaLFNBQWUsY0FBYyxDQUFDLE1BQXNCLEVBQUUsZUFBdUIsRUFBRSxPQUFlOzs7Ozs7b0JBQzFGLCtGQUErRjtvQkFDL0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUZBQWlGLEVBQUUsT0FBTyxDQUFDLENBQUE7d0JBQ3ZHLHNCQUFPO3FCQUNWO29CQUNzQixxQkFBTSxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDOzZCQUM5RSxZQUFZOzZCQUNaLE1BQU0sQ0FBQzs0QkFDSiwwQkFBMEIsRUFBRSxPQUFPO3lCQUN0QyxDQUFDOzZCQUNELElBQUksQ0FBQyxVQUFBLFdBQVcsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUE1QixDQUE0QixDQUFDLEVBQUE7O29CQUxoRCxjQUFjLEdBQUcsU0FLK0I7Ozs7O0NBQ3pEO0FBT0QsWUFBWTtBQUNDLFFBQUEsT0FBTyxHQUFnQyxJQUFBLCtDQUFjLEVBQUM7QUFDbkUsc0VBQXNFO0FBQ2xFLE9BQW1DLEVBQ25DLEtBQW1CLEVBQ25CLFFBQTRCOzs7Ozs7b0JBR3RCLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBRW5DLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFFdkMseUZBQXlGO29CQUN6RixRQUFRLENBQUMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMxRCxRQUFRLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQzFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBQ3RFLFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBRXRELGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO29CQUN4QyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztvQkFFNUIsb0NBQW9DO29CQUNwQyxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUM5QixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsb0NBQWdDLENBQUMsQ0FBQyxDQUFDO3dCQUMvRCxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUM1QixRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUM1QjtvQkFHZSxxQkFBTSxjQUFjLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJOzRCQUN0RixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7NEJBQ2hCLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO2dDQUM3QixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzZCQUMxQjs0QkFDRCxjQUFjOztnQ0FDVCxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMseUJBQXFCLENBQUMsQ0FBQyxDQUFDOzRCQUV6RCxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUM1QixRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUM3QixDQUFDLENBQUMsRUFBQTs7b0JBVkksT0FBTyxHQUFHLFNBVWQ7Ozs7O0NBQ0wsQ0FBQyxDQUFDO0FBQ0gsSUFBSSJ9