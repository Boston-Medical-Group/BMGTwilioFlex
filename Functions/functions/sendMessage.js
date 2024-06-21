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
require("@twilio-labs/serverless-runtime-types");
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var contentSid, contentVariables, conversationSid, Token, response, tokenInformation, worker_sid, identity, client, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contentSid = event.contentSid, contentVariables = event.contentVariables, conversationSid = event.conversationSid, Token = event.Token;
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, twilio_flex_token_validator_1.validator)(Token, context.ACCOUNT_SID || '', context.AUTH_TOKEN || '')];
                case 2:
                    tokenInformation = _a.sent();
                    worker_sid = tokenInformation.worker_sid, identity = tokenInformation.identity;
                    client = context.getTwilioClient();
                    return [4 /*yield*/, client.conversations.v1.conversations(conversationSid).messages.create({
                            contentSid: contentSid,
                            contentVariables: JSON.stringify(contentVariables),
                            author: identity
                        })];
                case 3:
                    _a.sent();
                    response.setBody(response);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        // If there's an error, send an error response.
                        // Keep using the response object for CORS purposes.
                        response.setBody({ error: err_1.message });
                    }
                    else {
                        response.setBody({});
                    }
                    response.setStatusCode(500);
                    return [3 /*break*/, 5];
                case 5:
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZE1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2VuZE1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBK0M7QUFFL0MsMkVBQWdJO0FBbUJoSSxZQUFZO0FBQ1osT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFBLCtDQUFzQixFQUFDLFVBQ3JDLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUFrQjs7Ozs7O29CQUdkLFVBQVUsR0FJVixLQUFLLFdBSkssRUFDVixnQkFBZ0IsR0FHaEIsS0FBSyxpQkFIVyxFQUNoQixlQUFlLEdBRWYsS0FBSyxnQkFGVSxFQUNmLEtBQUssR0FDTCxLQUFLLE1BREEsQ0FDQztvQkFLSixRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3ZDLFFBQVEsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzFELFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDMUUsUUFBUSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxjQUFjLENBQUMsQ0FBQztvQkFFdEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7OztvQkFJWCxxQkFBTSxJQUFBLHVDQUFjLEVBQzNELEtBQUssRUFDTCxPQUFPLENBQUMsV0FBVyxJQUFJLEVBQUUsRUFDekIsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQzNCLEVBQUE7O29CQUpLLGdCQUFnQixHQUFxQixTQUkxQztvQkFHRyxVQUFVLEdBRVYsZ0JBQWdCLFdBRk4sRUFDVixRQUFRLEdBQ1IsZ0JBQWdCLFNBRFIsQ0FDUztvQkFFZixNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUN6QyxxQkFBTSxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzs0QkFDekUsVUFBVSxZQUFBOzRCQUNWLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUM7NEJBQ2xELE1BQU0sRUFBRSxRQUFRO3lCQUNuQixDQUFDLEVBQUE7O29CQUpGLFNBSUUsQ0FBQTtvQkFFRixRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7O29CQUczQixJQUFJLEtBQUcsWUFBWSxLQUFLLEVBQUU7d0JBQ3RCLCtDQUErQzt3QkFDL0Msb0RBQW9EO3dCQUNwRCxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO3FCQUM1Qzt5QkFBTTt3QkFDSCxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN4QjtvQkFDRCxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7b0JBR2hDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Ozs7O0NBQzVCLENBQUMsQ0FBQyJ9