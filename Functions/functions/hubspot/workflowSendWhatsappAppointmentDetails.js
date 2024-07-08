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
exports.handler = void 0;
var api_client_1 = require("@hubspot/api-client");
/**
 *
 * Available parameters:
 * - template?
 * - contactId?
 * - phone
 * - objectId?
 * - objectType?
 * - param_*?
 * - customParam?
 *
 */
var handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var client, parameters, attributes, currentlyRequiredAttributes, returnObject, whatsappAddressTo_1, whatsappAddressFrom_1, activeConversation, timestamp, msg, error_1;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                client = context.getTwilioClient();
                parameters = Object.keys(event)
                    .filter(function (k) { return k.indexOf('param_') == 0; })
                    .reduce(function (newObj, k) {
                    var propName = k.replace('param_', '');
                    //@ts-ignore
                    newObj[parseInt(propName)] = event[k];
                    return newObj;
                }, {});
                if (!event.hasOwnProperty('template')) {
                    return [2 /*return*/, callback(null, 'ERROR: Missing template')];
                }
                attributes = Object.keys(event)
                    .filter(function (k) { return k.indexOf('param_') != 0 && k != 'request'; })
                    .reduce(function (newObj, k) {
                    //@ts-ignore
                    newObj[k] = event[k];
                    return newObj;
                }, {});
                currentlyRequiredAttributes = ['customerName', 'name', 'crmid', 'hubspot_contact_id'];
                currentlyRequiredAttributes.forEach(function (k) {
                    var _a;
                    if (!attributes.hasOwnProperty(k)) {
                        if (k == 'customerName' || k == 'name') {
                            attributes[k] = (_a = event.fullname) !== null && _a !== void 0 ? _a : 'Unknown name';
                        }
                        else if (k == 'crmid' || k == 'hubspot_contact_id') {
                            attributes[k] = event.contactId;
                        }
                    }
                });
                returnObject = { 'result': 'OK' };
                _g.label = 1;
            case 1:
                _g.trys.push([1, 8, , 9]);
                whatsappAddressTo_1 = event.phone.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(event.phone) : "".concat(event.phone);
                whatsappAddressFrom_1 = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(context.TWILIO_WA_PHONE_NUMBER) : "".concat(context.TWILIO_WA_PHONE_NUMBER);
                return [4 /*yield*/, getActiveConversation(context, whatsappAddressTo_1)];
            case 2:
                activeConversation = _g.sent();
                if (!(activeConversation === null)) return [3 /*break*/, 4];
                timestamp = (new Date).getTime();
                return [4 /*yield*/, client.conversations.v1.conversations.create({
                        friendlyName: "HubspotWorkflow -> ".concat(event.phone, " (").concat(timestamp, ")"),
                        attributes: JSON.stringify(attributes),
                        timers: {
                            inactive: 'PT30M',
                            closed: 'PT1H'
                        }
                    }).then(function (conversation) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).participants.create({
                                        //@ts-ignore
                                        "messagingBinding.address": whatsappAddressTo_1,
                                        "messagingBinding.proxyAddress": whatsappAddressFrom_1
                                    }).then(function (participant) { return __awaiter(void 0, void 0, void 0, function () {
                                        var msg;
                                        var _a, _b, _c, _d, _e, _f;
                                        return __generator(this, function (_g) {
                                            switch (_g.label) {
                                                case 0: return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                        contentSid: event.template,
                                                        contentVariables: JSON.stringify(parameters)
                                                    })];
                                                case 1:
                                                    msg = _g.sent();
                                                    return [4 /*yield*/, createNobodyTask({
                                                            context: context,
                                                            from: whatsappAddressTo_1,
                                                            conversationSid: conversation.sid,
                                                            flowName: (_a = event.flowName) !== null && _a !== void 0 ? _a : 'Unknown Flow',
                                                            name: event.fullname,
                                                            leadOrPatient: (_b = event.leadOrPatient) !== null && _b !== void 0 ? _b : '',
                                                            contactId: event.contactId,
                                                            hubspotAccountId: (_c = event.hubspotAccountId) !== null && _c !== void 0 ? _c : undefined,
                                                            implementation: (_d = event.implementation) !== null && _d !== void 0 ? _d : 'Transactional',
                                                            abandoned: (_e = event.abandoned) !== null && _e !== void 0 ? _e : 'No',
                                                            customParam: (_f = event.customParam) !== null && _f !== void 0 ? _f : ''
                                                        }).then(function (task) { return __awaiter(void 0, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, client.taskrouter.v1
                                                                            .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                                                                            .tasks
                                                                            .get(task.sid)
                                                                            .update({
                                                                            assignmentStatus: 'canceled'
                                                                        })];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).update({
                                                                                state: 'closed'
                                                                            })];
                                                                    case 2:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); })];
                                                case 2:
                                                    _g.sent();
                                                    returnObject = __assign(__assign({}, returnObject), { sid: msg.sid, body: msg.body });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
            case 3:
                _g.sent();
                return [3 /*break*/, 7];
            case 4:
                msg = void 0;
                return [4 /*yield*/, client.conversations.v1.conversations(activeConversation).messages.create({
                        contentSid: event.template,
                        contentVariables: JSON.stringify(parameters)
                    })];
            case 5:
                msg = _g.sent();
                return [4 /*yield*/, createNobodyTask({
                        context: context,
                        from: whatsappAddressTo_1,
                        conversationSid: activeConversation,
                        flowName: (_a = event.flowName) !== null && _a !== void 0 ? _a : 'Unknown Flow',
                        name: event.fullname,
                        leadOrPatient: (_b = event.leadOrPatient) !== null && _b !== void 0 ? _b : '',
                        contactId: event.contactId,
                        hubspotAccountId: (_c = event.hubspotAccountId) !== null && _c !== void 0 ? _c : undefined,
                        implementation: (_d = event.implementation) !== null && _d !== void 0 ? _d : 'Transactional',
                        abandoned: (_e = event.abandoned) !== null && _e !== void 0 ? _e : 'No',
                        customParam: (_f = event.customParam) !== null && _f !== void 0 ? _f : ''
                    }).then(function (task) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.taskrouter.v1
                                        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                                        .tasks
                                        .get(task.sid)
                                        .update({
                                        assignmentStatus: 'canceled'
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 6:
                _g.sent();
                returnObject = __assign(__assign({}, returnObject), { sid: msg.sid, body: msg.body });
                _g.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _g.sent();
                console.log(error_1);
                returnObject.result = 'ERROR';
                returnObject.error = error_1;
                return [3 /*break*/, 9];
            case 9:
                callback(null, returnObject);
                return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
var getActiveConversation = function (context, whatsappAddressTo) { return __awaiter(void 0, void 0, void 0, function () {
    var client, conversations, activeConversation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = context.getTwilioClient();
                return [4 /*yield*/, client.conversations.v1.participantConversations.list({
                        address: whatsappAddressTo,
                        limit: 50,
                    })];
            case 1:
                conversations = _a.sent();
                activeConversation = conversations.find(function (conversation) { return conversation.conversationState === 'active'; });
                if (activeConversation != undefined) {
                    return [2 /*return*/, activeConversation.conversationSid];
                }
                return [2 /*return*/, null];
        }
    });
}); };
var createNobodyTask = function (_a) {
    var context = _a.context, from = _a.from, conversationSid = _a.conversationSid, flowName = _a.flowName, name = _a.name, leadOrPatient = _a.leadOrPatient, contactId = _a.contactId, hubspotAccountId = _a.hubspotAccountId, implementation = _a.implementation, abandoned = _a.abandoned, customParam = _a.customParam;
    return __awaiter(void 0, void 0, void 0, function () {
        var client, conversations, customers, hubspotClient, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = context.getTwilioClient();
                    conversations = {};
                    conversations.conversation_id = conversationSid;
                    conversations.virtual = "Yes";
                    conversations.abandoned = abandoned === "true" ? "Yes" : "No";
                    conversations.abandoned_phase = "BOT";
                    conversations.kind = "Bot";
                    conversations.direction = "outbound";
                    conversations.communication_channel = "Chat";
                    conversations.conversation_label_1 = "Conversation Sid";
                    conversations.conversation_attribute_1 = conversationSid;
                    conversations.conversation_label_2 = "Flow Name";
                    conversations.conversation_attribute_2 = flowName;
                    conversations.conversation_label_4 = "BOT implementation";
                    conversations.conversation_attribute_4 = implementation;
                    customers = {};
                    customers.customer_label_1 = "Lead or Patient";
                    customers.customer_attribute_1 = leadOrPatient;
                    customers.customer_label_2 = "URL Hubspot";
                    customers.customer_label_3 = "Tipo cita";
                    customers.customer_attribute_3 = customParam !== null && customParam !== void 0 ? customParam : '';
                    if (!!hubspotAccountId) return [3 /*break*/, 4];
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, hubspotClient.oauth.accessTokensApi.get(context.HUBSPOT_TOKEN)
                            .then(function (response) { return response.hubId; })];
                case 2:
                    hubspotAccountId = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4:
                    customers.customer_attribute_2 = "https://app-eu1.hubspot.com/contacts/".concat(hubspotAccountId, "/record/0-1/").concat(contactId);
                    return [2 /*return*/, client.taskrouter.v1
                            .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                            .tasks.create({
                            attributes: JSON.stringify({ "from": from, "name": name, conversations: conversations, customers: customers }),
                            workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
                            timeout: 86400
                        })];
            }
        });
    });
};
var setUnauthorized = function (response) {
    response
        .setBody('Unauthorized')
        .setStatusCode(401)
        .appendHeader('WWW-Authenticate', 'Basic realm="Authentication Required"');
    return response;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBBcHBvaW50bWVudERldGFpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaHVic3BvdC93b3JrZmxvd1NlbmRXaGF0c2FwcEFwcG9pbnRtZW50RGV0YWlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGtEQUE4RDtBQXNCOUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFFSSxJQUFNLE9BQU8sR0FBRyxVQUNuQixPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7OztnQkF3QnRCLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUE7Z0JBRXBDLFVBQVUsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztxQkFDdEMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQXhCLENBQXdCLENBQUM7cUJBQ3ZDLE1BQU0sQ0FBQyxVQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNkLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN2QyxZQUFZO29CQUNaLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLE9BQU8sTUFBTSxDQUFDO2dCQUNsQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBRVYsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ25DLHNCQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLENBQUMsRUFBQztpQkFDcEQ7Z0JBRUcsVUFBVSxHQUE4QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztx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