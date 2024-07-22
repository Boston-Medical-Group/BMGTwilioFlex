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
        var response, sendResponse_1, whatsappConversations, smsConversations, _i, whatsappConversations_1, wc, _a, smsConversations_1, sc, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    sendResponse_1 = [];
                    if (!event.phone) return [3 /*break*/, 4];
                    return [4 /*yield*/, context.getTwilioClient().conversations.v1.participantConversations.list({
                            limit: 100,
                            address: event.phone.startsWith('whatsapp:') ? event.phone : "whatsapp:".concat(event.phone)
                        }).then(function (data) {
                            return data.filter(function (item) { return item.conversationState === "active"; });
                        })];
                case 2:
                    whatsappConversations = _b.sent();
                    return [4 /*yield*/, context.getTwilioClient().conversations.v1.participantConversations.list({
                            limit: 100,
                            address: event.phone
                        }).then(function (data) {
                            return data.filter(function (item) { return item.conversationState === "active"; });
                        })];
                case 3:
                    smsConversations = _b.sent();
                    for (_i = 0, whatsappConversations_1 = whatsappConversations; _i < whatsappConversations_1.length; _i++) {
                        wc = whatsappConversations_1[_i];
                        sendResponse_1.push({
                            account_sid: wc.accountSid,
                            attributes: wc.conversationAttributes,
                            bindings: wc.participantMessagingBinding,
                            chat_service_sid: wc.chatServiceSid,
                            dateCreated: wc.conversationDateCreated,
                            dateUpdated: wc.conversationDateUpdated,
                            friendly_name: wc.conversationFriendlyName,
                            links: wc.links,
                            sid: wc.conversationSid,
                            state: wc.conversationState,
                            timers: wc.conversationTimers,
                            unique_name: wc.conversationUniqueName
                        });
                    }
                    for (_a = 0, smsConversations_1 = smsConversations; _a < smsConversations_1.length; _a++) {
                        sc = smsConversations_1[_a];
                        sendResponse_1.push({
                            account_sid: sc.accountSid,
                            attributes: sc.conversationAttributes,
                            bindings: sc.participantMessagingBinding,
                            chat_service_sid: sc.chatServiceSid,
                            dateCreated: sc.conversationDateCreated,
                            dateUpdated: sc.conversationDateUpdated,
                            friendly_name: sc.conversationFriendlyName,
                            links: sc.links,
                            sid: sc.conversationSid,
                            state: sc.conversationState,
                            timers: sc.conversationTimers,
                            unique_name: sc.conversationUniqueName
                        });
                    }
                    return [3 /*break*/, 8];
                case 4:
                    if (!event.page) return [3 /*break*/, 6];
                    return [4 /*yield*/, context.getTwilioClient().conversations.v1.conversations.getPage(event.page).then(function (data) {
                            sendResponse_1 = data;
                        })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, context.getTwilioClient().conversations.v1.conversations.page({
                        //@ts-ignore
                        state: "active",
                        pageSize: 20,
                        pageToken: event.page
                    }).then(function (data) {
                        sendResponse_1 = data;
                    })];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    response.setBody(sendResponse_1);
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _b.sent();
                    response.setStatusCode(500);
                    if (err_1 instanceof Error) {
                        response.setBody({ error: err_1.message });
                    }
                    else {
                        response.setBody({ error: err_1 });
                    }
                    return [3 /*break*/, 10];
                case 10:
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QWN0aXZlQ29udmVyc2F0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXRBY3RpdmVDb252ZXJzYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQStDO0FBRS9DLDJFQUFnSTtBQXVCaEksWUFBWTtBQUNaLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBQSwrQ0FBc0IsRUFBQyxVQUNyQyxPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBa0I7Ozs7OztvQkFHWixRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3ZDLFFBQVEsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzFELFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDMUUsUUFBUSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxjQUFjLENBQUMsQ0FBQztvQkFDdEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7OztvQkFHbEQsaUJBQXFCLEVBQUUsQ0FBQzt5QkFDeEIsS0FBSyxDQUFDLEtBQUssRUFBWCx3QkFBVztvQkFDbUIscUJBQU0sT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDOzRCQUN6RyxLQUFLLEVBQUUsR0FBRzs0QkFDVixPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLG1CQUFZLEtBQUssQ0FBQyxLQUFLLENBQUU7eUJBQ3pGLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJOzRCQUNULE9BQU8sSUFBSSxDQUFD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