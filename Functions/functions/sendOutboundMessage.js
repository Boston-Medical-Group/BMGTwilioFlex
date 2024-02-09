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
var openAChatTask = function (client, To, customerName, From, Body, WorkerConversationIdentity, channel, hubspot_contact_id, hubspot_deal_id, routingProperties) { return __awaiter(void 0, void 0, void 0, function () {
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
                /*
                const messageDelivery = await client.conversations
                    .v1
                    .conversations(taskAttributes.conversationSid)
                    .messages.create({ author: WorkerConversationIdentity, body: Body })
                    .then(async message => {
                        // wait 1 second before the next statement
                        return await new Promise(resolve => setTimeout(resolve, 5000)).then(async () => {
                            return await message.deliveryReceipts().list({ limit: 1, pageSize: 1 })
                                .then(async (deliveryReceipts) => {
                                    if (deliveryReceipts.length === 0) {
                                        await client.flexApi.v1
                                        return 0
                                    }
            
                                    if (deliveryReceipts[0].errorCode === 63016) {
                                        return 63016
                                    }
            
                                    return 0
                                })
                                .catch(err => err)
                        });
                        
                    })
                    .catch(err => err);
                    */
                //console.log('MESSAGESENT', messageDelivery)
                return [2 /*return*/, {
                        //result: messageDelivery,
                        success: true, // todo usar resultado de messageDelivery
                        interactionSid: interaction.sid,
                        conversationSid: taskAttributes.conversationSid
                    }];
        }
    });
}); };
var sendOutboundMessage = function (
//@ts-ignore
client, To, From, Body, KnownAgentRoutingFlag, WorkerFriendlyName, WorkerConversationIdentity, studioFlowSid) { return __awaiter(void 0, void 0, void 0, function () {
    var friendlyName, converstationAttributes, attributes, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                friendlyName = "Outbound ".concat(From, " -> ").concat(To);
                converstationAttributes = { KnownAgentRoutingFlag: KnownAgentRoutingFlag };
                if (KnownAgentRoutingFlag)
                    converstationAttributes.KnownAgentWorkerFriendlyName = WorkerFriendlyName;
                attributes = JSON.stringify(converstationAttributes);
                return [4 /*yield*/, client.conversations.v1.conversations.create({
                        friendlyName: friendlyName,
                        attributes: attributes
                    })];
            case 1:
                channel = _a.sent();
                // Add customer to channel
                return [4 /*yield*/, client.conversations
                        .v1
                        .conversations(channel.sid)
                        .participants.create({
                        'messagingBinding.address': To,
                        'messagingBinding.proxyAddress': From
                    })];
            case 2:
                // Add customer to channel
                _a.sent();
                // Point the channel to Studio
                return [4 /*yield*/, client.conversations
                        .v1
                        .conversations(channel.sid)
                        .webhooks.create({
                        target: "studio",
                        "configuration.flowSid": studioFlowSid,
                    })];
            case 3:
                // Point the channel to Studio
                _a.sent();
                console.log('ADDING AGENT');
                // Add agents initial message
                return [4 /*yield*/, client.conversations
                        .v1
                        .conversations(channel.sid)
                        .messages.create({ author: WorkerConversationIdentity, body: Body })];
            case 4:
                // Add agents initial message
                _a.sent();
                return [2 /*return*/, { success: true, channelSid: channel.sid }];
        }
    });
}); };
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var To, Body, customerName, hubspot_contact_id, hubspot_deal_id, WorkerFriendlyName, Token, OpenChatFlag, KnownAgentRoutingFlag, channel, From, client, response, sendResponse, tokenInformation, worker_sid, identity, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    To = event.To, Body = event.Body, customerName = event.customerName, hubspot_contact_id = event.hubspot_contact_id, hubspot_deal_id = event.hubspot_deal_id, WorkerFriendlyName = event.WorkerFriendlyName, Token = event.Token;
                    OpenChatFlag = event.OpenChatFlag, KnownAgentRoutingFlag = event.KnownAgentRoutingFlag;
                    channel = To.includes('whatsapp') ? 'whatsapp' : 'sms';
                    From = channel === 'whatsapp' ? "whatsapp:".concat(context.TWILIO_WA_PHONE_NUMBER) : context.TWILIO_PHONE_NUMBER;
                    client = context.getTwilioClient();
                    console.log("To : ".concat(To));
                    console.log("From : ".concat(From));
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    sendResponse = null;
                    return [4 /*yield*/, (0, twilio_flex_token_validator_1.validator)(Token, context.ACCOUNT_SID || '', context.AUTH_TOKEN || '')];
                case 2:
                    tokenInformation = _a.sent();
                    worker_sid = tokenInformation.worker_sid, identity = tokenInformation.identity;
                    if (!OpenChatFlag) return [3 /*break*/, 4];
                    return [4 /*yield*/, openAChatTask(
                        //@ts-ignore
                        client, To, customerName, From, Body, identity, channel, hubspot_contact_id, hubspot_deal_id, {
                            workspace_sid: context.TASK_ROUTER_WORKSPACE_SID,
                            workflow_sid: context.TASK_ROUTER_WORKFLOW_SID,
                            queue_sid: context.FLEX_APP_OUTBOUND_WHATSAPP_QUEUE_SID,
                            worker_sid: worker_sid
                        })];
                case 3:
                    // create task and add the message to a channel
                    sendResponse = _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, sendOutboundMessage(client, To, From, Body, KnownAgentRoutingFlag, WorkerFriendlyName, identity, context.INBOUND_SMS_STUDIO_FLOW)];
                case 5:
                    // create a channel but wait until customer replies before creating a task
                    sendResponse = _a.sent();
                    _a.label = 6;
                case 6:
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody(sendResponse);
                    return [3 /*break*/, 8];
                case 7:
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
                    return [3 /*break*/, 8];
                case 8:
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZE91dGJvdW5kTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZW5kT3V0Ym91bmRNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBK0M7QUFFL0MsMkVBQWdJO0FBR2hJLElBQU0sYUFBYSxHQUFHLFVBQ2xCLE1BQXFCLEVBQ3JCLEVBQVUsRUFDVixZQUFvQixFQUNwQixJQUFZLEVBQ1osSUFBWSxFQUNaLDBCQUFrQyxFQUNsQyxPQUFZLEVBQ1osa0JBQTBCLEVBQzFCLGVBQXVCLEVBQ3ZCLGlCQUFzQjs7OztvQkFHRixxQkFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO29CQUMzRCxPQUFPLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLE9BQU87d0JBQ2IsWUFBWSxFQUFFLE9BQU87d0JBQ3JCLFlBQVksRUFBRTs0QkFDVjtnQ0FDSSxPQUFPLEVBQUUsRUFBRTtnQ0FDWCxhQUFhLEVBQUUsSUFBSTs2QkFDdEI7eUJBQ0o7cUJBQ0o7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFVBQVUsd0JBQ0gsaUJBQWlCLEtBQ3BCLHdCQUF3QixFQUFFLE9BQU8sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUNuRSxVQUFVLEVBQUU7Z0NBQ1IsSUFBSSxFQUFFLFlBQVk7Z0NBQ2xCLGtCQUFrQixvQkFBQTtnQ0FDbEIsZUFBZSxpQkFBQTtnQ0FDZixJQUFJLEVBQUUsRUFBRTtnQ0FDUixTQUFTLEVBQUUsVUFBVTtnQ0FDckIsWUFBWSxFQUFFLFlBQVk7Z0NBQzFCLGVBQWUsRUFBRSxFQUFFO2dDQUNuQixZQUFZLEVBQUUsSUFBSTtnQ0FDbEIsV0FBVyxFQUFFLE9BQU87NkJBQ3ZCLEdBQ0o7cUJBQ0o7aUJBQ0osQ0FBQyxFQUFBOztn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