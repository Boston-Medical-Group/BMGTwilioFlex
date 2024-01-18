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
require("@twilio-labs/serverless-runtime-types");
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
var openAChatTask = function (client, To, customerName, From, WorkerConversationIdentity, channel, hubspotContact, hubspot_contact_id, hubspot_deal_id, routingProperties) { return __awaiter(void 0, void 0, void 0, function () {
    var interaction, taskAttributes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.flexApi.v1.interaction.create({
                    channel: {
                        type: channel,
                        initiated_by: "agent",
                        participants: [
                            {
                                address: To,
                                proxy_address: From,
                            },
                        ],
                    },
                    routing: {
                        properties: __assign(__assign({}, routingProperties), { task_channel_unique_name: channel === 'whatsapp' ? 'chat' : channel, attributes: {
                                hubspotContact: hubspotContact,
                                name: customerName,
                                hubspot_contact_id: hubspot_contact_id,
                                hubspot_deal_id: hubspot_deal_id,
                                from: To,
                                direction: "outbound",
                                customerName: customerName,
                                customerAddress: To,
                                twilioNumber: From,
                                channelType: channel
                            } }),
                    }
                })];
            case 1:
                interaction = _a.sent();
                taskAttributes = JSON.parse(interaction.routing.properties.attributes);
                return [2 /*return*/, {
                        success: true,
                        interactionSid: interaction.sid,
                        conversationSid: taskAttributes.conversationSid
                    }];
        }
    });
}); };
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var To, customerName, hubspotContact, hubspot_contact_id, hubspot_deal_id, WorkerFriendlyName, Token, OpenChatFlag, KnownAgentRoutingFlag, channel, From, client, response, sendResponse, tokenInformation, worker_sid, identity, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    To = event.To, customerName = event.customerName, hubspotContact = event.hubspotContact, hubspot_contact_id = event.hubspot_contact_id, hubspot_deal_id = event.hubspot_deal_id, WorkerFriendlyName = event.WorkerFriendlyName, Token = event.Token;
                    OpenChatFlag = event.OpenChatFlag, KnownAgentRoutingFlag = event.KnownAgentRoutingFlag;
                    channel = To.includes('whatsapp') ? 'whatsapp' : 'sms';
                    From = channel === 'whatsapp' ? "whatsapp:".concat(context.TWILIO_WA_PHONE_NUMBER) : context.TWILIO_PHONE_NUMBER;
                    client = context.getTwilioClient();
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    sendResponse = null;
                    return [4 /*yield*/, (0, twilio_flex_token_validator_1.validator)(Token, context.ACCOUNT_SID || '', context.AUTH_TOKEN || '')];
                case 2:
                    tokenInformation = _a.sent();
                    worker_sid = tokenInformation.worker_sid, identity = tokenInformation.identity;
                    return [4 /*yield*/, openAChatTask(
                        //@ts-ignore
                        client, To, customerName, From, identity, channel, hubspotContact, hubspot_contact_id, hubspot_deal_id, {
                            workspace_sid: context.TASK_ROUTER_WORKSPACE_SID,
                            workflow_sid: context.TASK_ROUTER_WORKFLOW_SID,
                            queue_sid: context.FLEX_APP_OUTBOUND_WHATSAPP_QUEUE_SID,
                            worker_sid: worker_sid
                        })];
                case 3:
                    // create task and add the message to a channel
                    sendResponse = _a.sent();
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody(sendResponse);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        response.appendHeader("Content-Type", "plain/text");
                        response.setBody(err_1.message);
                        response.setStatusCode(500);
                        // If there's an error, send an error response
                        // Keep using the response object for CORS purposes
                    }
                    else {
                        response.setBody({});
                    }
                    return [3 /*break*/, 5];
                case 5:
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRPdXRib3VuZENvbnZlcnNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGFydE91dGJvdW5kQ29udmVyc2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBK0M7QUFFL0MsMkVBQWdJO0FBR2hJLElBQU0sYUFBYSxHQUFHLFVBQ2xCLE1BQXFCLEVBQ3JCLEVBQVUsRUFDVixZQUFvQixFQUNwQixJQUFZLEVBQ1osMEJBQWtDLEVBQ2xDLE9BQVksRUFDWixjQUFzQixFQUN0QixrQkFBMEIsRUFDMUIsZUFBdUIsRUFDdkIsaUJBQXNCOzs7O29CQUdGLHFCQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7b0JBQzNELE9BQU8sRUFBRTt3QkFDTCxJQUFJLEVBQUUsT0FBTzt3QkFDYixZQUFZLEVBQUUsT0FBTzt3QkFDckIsWUFBWSxFQUFFOzRCQUNWO2dDQUNJLE9BQU8sRUFBRSxFQUFFO2dDQUNYLGFBQWEsRUFBRSxJQUFJOzZCQUN0Qjt5QkFDSjtxQkFDSjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsVUFBVSx3QkFDSCxpQkFBaUIsS0FDcEIsd0JBQXdCLEVBQUUsT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQ25FLFVBQVUsRUFBRTtnQ0FDUixjQUFjLGdCQUFBO2dDQUNkLElBQUksRUFBRSxZQUFZO2dDQUNsQixrQkFBa0Isb0JBQUE7Z0NBQ2xCLGVBQWUsaUJBQUE7Z0NBQ2YsSUFBSSxFQUFFLEVBQUU7Z0NBQ1IsU0FBUyxFQUFFLFVBQVU7Z0NBQ3JCLFlBQVksRUFBRSxZQUFZO2dDQUMxQixlQUFlLEVBQUUsRUFBRTtnQ0FDbkIsWUFBWSxFQUFFLElBQUk7Z0NBQ2xCLFdBQVcsRUFBRSxPQUFPOzZCQUN2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