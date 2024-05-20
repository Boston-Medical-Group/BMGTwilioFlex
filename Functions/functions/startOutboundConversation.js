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
/**
 * Get an active conversation for this contact
 */
var getActiveConversation = function (client, to) { return __awaiter(void 0, void 0, void 0, function () {
    var participantConversations, participantConversation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.conversations.v1.participantConversations.list({
                    limit: 100,
                    pageSize: 100,
                    address: to
                })
                // Find first participantConversation with state active
            ];
            case 1:
                participantConversations = _a.sent();
                participantConversation = participantConversations.find(function (participantConversation) { return participantConversation.conversationState === 'active'; });
                if (!participantConversation) return [3 /*break*/, 3];
                return [4 /*yield*/, client.conversations.v1.conversations(participantConversation.conversationSid).fetch()];
            case 2: return [2 /*return*/, _a.sent()];
            case 3: return [2 /*return*/, false];
        }
    });
}); };
var openAChatTask = function (client, To, customerName, From, WorkerConversationIdentity, // Worker identity
channel, hubspotContact, hubspot_contact_id, hubspot_deal_id, routingProperties) { return __awaiter(void 0, void 0, void 0, function () {
    var conversation, conversationSid, participants, agent, interaction, taskAttributes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getActiveConversation(client, To)];
            case 1:
                conversation = _a.sent();
                if (!conversation) return [3 /*break*/, 3];
                return [4 /*yield*/, conversation.participants().list()
                    // If more than one participant
                ];
            case 2:
                participants = _a.sent();
                // If more than one participant
                if (participants.length > 1) {
                    agent = participants.find(function (participant) { return participant.identity === WorkerConversationIdentity; });
                    if (!agent) { // Not the current agent
                        return [2 /*return*/, {
                                success: false,
                                errorMessage: 'ALREADY_ACTIVE_CONVERSATION_WITH_ANOTHER_AGENT'
                            }];
                    }
                    else { // Conversation is linked to current agent, cant start a new one
                        return [2 /*return*/, {
                                success: false,
                                errorMessage: 'ALREADY_ACTIVE_CONVERSATION_WITH_AGENT'
                            }];
                    }
                }
                else {
                    // Orphan conversation. ...notify
                    return [2 /*return*/, {
                            success: false,
                            errorMessage: 'ALREADY_ACTIVE_CONVERSATION_WITHOUT_AGENT'
                        }];
                    // @todo Should route the conversation to current agent
                    /* BAD PRACTICE
                    await client.conversations.v1.conversations(conversation.sid).participants.create({
                        identity: WorkerConversationIdentity
                    })
                    conversationSid = conversation.sid
                    */
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, client.flexApi.v1.interaction.create({
                    channel: {
                        type: channel,
                        initiated_by: "agent",
                        participants: [
                            {
                                address: To,
                                proxy_address: From,
                            },
                        ],
                        xTwilioWebhookEnabled: true,
                        friendlyName: "Outbound: ".concat(From, " -> ").concat(To),
                    },
                    routing: {
                        properties: __assign(__assign({}, routingProperties), { task_channel_unique_name: channel === 'whatsapp' ? 'chat' : channel, attributes: {
                                //conversationSid, // Disabled due that agent is not added as a participant
                                direction: "outbound",
                                channelType: channel,
                                xTwilioWebhookEnabled: true,
                                from: To,
                                name: customerName,
                                hubspotContact: hubspotContact,
                                hubspot_contact_id: hubspot_contact_id,
                                hubspot_deal_id: hubspot_deal_id,
                                twilioNumber: From,
                                customerName: customerName,
                                customerAddress: To,
                                customers: {
                                    external_id: hubspotContact.hs_object_id || null,
                                    phone: hubspotContact.phone || null,
                                    email: hubspotContact.email || null
                                }
                            } }),
                    }
                })];
            case 4:
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
                            worker_sid: worker_sid // Perhaps knownWorker
                        })];
                case 3:
                    // create task and open chat window for user
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRPdXRib3VuZENvbnZlcnNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGFydE91dGJvdW5kQ29udmVyc2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBK0M7QUFFL0MsMkVBQWdJO0FBZWhJOztHQUVHO0FBQ0gsSUFBTSxxQkFBcUIsR0FBRyxVQUFPLE1BQXNCLEVBQUUsRUFBVzs7OztvQkFDbkMscUJBQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDO29CQUN6RixLQUFLLEVBQUUsR0FBRztvQkFDVixRQUFRLEVBQUUsR0FBRztvQkFDYixPQUFPLEVBQUUsRUFBRTtpQkFDZCxDQUFDO2dCQUVGLHVEQUF1RDtjQUZyRDs7Z0JBSkksd0JBQXdCLEdBQUcsU0FJL0I7Z0JBR0ksdUJBQXVCLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFVBQUMsdUJBQXdELElBQUssT0FBQSx1QkFBdUIsQ0FBQyxpQkFBaUIsS0FBSyxRQUFRLEVBQXRELENBQXNELENBQUMsQ0FBQTtxQkFDL0ssdUJBQXVCLEVBQXZCLHdCQUF1QjtnQkFDaEIscUJBQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFBO29CQUFuRyxzQkFBTyxTQUE0RixFQUFDO29CQUd4RyxzQkFBTyxLQUFLLEVBQUM7OztLQUNoQixDQUFBO0FBRUQsSUFBTSxhQUFhLEdBQUcsVUFDbEIsTUFBcUIsRUFDckIsRUFBVSxFQUNWLFlBQW9CLEVBQ3BCLElBQVksRUFDWiwwQkFBa0MsRUFBRSxrQkFBa0I7QUFDdEQsT0FBWSxFQUNaLGNBQThCLEVBQzlCLGtCQUEwQixFQUMxQixlQUF1QixFQUN2QixpQkFBc0I7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