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
    var authHeader, response, _a, authType, credentials, _b, username, password, client, parameters, attributes, currentlyRequiredAttributes, returnObject, phone, altphone, whatsappAddressTo_1, whatsappAddressFrom_1, activeConversation_1, timestamp, conversationAttributes, msg, templateName_1, error_1;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                authHeader = event.request.headers.authorization;
                response = new Twilio.Response();
                // Reject requests that don't have an Authorization header
                if (!authHeader)
                    return [2 /*return*/, callback(null, setUnauthorized(response))];
                _a = authHeader.split(' '), authType = _a[0], credentials = _a[1];
                // If the auth type doesn't match Basic, reject the request
                if (authType.toLowerCase() !== 'basic')
                    return [2 /*return*/, callback(null, setUnauthorized(response))];
                _b = Buffer.from(credentials, 'base64')
                    .toString()
                    .split(':'), username = _b[0], password = _b[1];
                // If the username or password don't match the expected values, reject
                if (username !== context.ACCOUNT_SID || password !== context.AUTH_TOKEN)
                    return [2 /*return*/, callback(null, setUnauthorized(response))];
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
                _j.label = 1;
            case 1:
                _j.trys.push([1, 9, , 10]);
                phone = event.phone, altphone = event.altphone;
                phone = phone == '' ? altphone : phone;
                if (!phone || phone == undefined || phone == '') {
                    console.log('Invalid phone provided');
                    returnObject.result = 'ERROR';
                    returnObject.error = 'Invalid phone provided';
                    return [2 /*return*/, callback(returnObject)];
                }
                phone = phone.toString();
                phone = phone.replace('whatsapp:', '');
                phone = phone.startsWith('+') ? phone : "+".concat(phone);
                whatsappAddressTo_1 = "whatsapp:".concat(phone);
                whatsappAddressFrom_1 = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(context.TWILIO_WA_PHONE_NUMBER) : "".concat(context.TWILIO_WA_PHONE_NUMBER);
                return [4 /*yield*/, getActiveConversation(context, whatsappAddressTo_1)];
            case 2:
                activeConversation_1 = _j.sent();
                if (!(activeConversation_1 === null)) return [3 /*break*/, 4];
                timestamp = (new Date).getTime();
                conversationAttributes = {
                    friendlyName: "HubspotWorkflow -> ".concat(phone, " (").concat(timestamp, ")"),
                    attributes: JSON.stringify(attributes),
                    //@ts-ignore
                    "timers.inactive": 'PT30M',
                    //@ts-ignore
                    "timers.closed": 'PT1H'
                };
                return [4 /*yield*/, client.conversations.v1.conversations.create(conversationAttributes).then(function (conversation) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).participants.create({
                                        //@ts-ignore
                                        "messagingBinding.address": whatsappAddressTo_1,
                                        "messagingBinding.proxyAddress": whatsappAddressFrom_1
                                    }).then(function (participant) { return __awaiter(void 0, void 0, void 0, function () {
                                        var msg, templateName;
                                        var _a, _b, _c, _d, _e, _f;
                                        return __generator(this, function (_g) {
                                            switch (_g.label) {
                                                case 0:
                                                    templateName = '';
                                                    return [4 /*yield*/, client.content.v1.contents(event.template)
                                                            .fetch()
                                                            .then(function (content) {
                                                            templateName = content.friendlyName;
                                                        })];
                                                case 1:
                                                    _g.sent();
                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                            contentSid: event.template,
                                                            contentVariables: JSON.stringify(parameters)
                                                        })];
                                                case 2:
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
                                                            customParam: (_f = event.customParam) !== null && _f !== void 0 ? _f : 'nodata',
                                                            templateName: templateName
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
                                                case 3:
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
                _j.sent();
                return [3 /*break*/, 8];
            case 4:
                msg = void 0;
                templateName_1 = '';
                return [4 /*yield*/, client.content.v1.contents(event.template)
                        .fetch()
                        .then(function (content) {
                        templateName_1 = content.friendlyName;
                    })];
            case 5:
                _j.sent();
                return [4 /*yield*/, client.conversations.v1.conversations(activeConversation_1).messages.create({
                        contentSid: event.template,
                        contentVariables: JSON.stringify(parameters)
                    })];
            case 6:
                msg = _j.sent();
                return [4 /*yield*/, createNobodyTask({
                        context: context,
                        from: whatsappAddressTo_1,
                        conversationSid: activeConversation_1,
                        flowName: (_c = event.flowName) !== null && _c !== void 0 ? _c : 'Unknown Flow',
                        name: event.fullname,
                        leadOrPatient: (_d = event.leadOrPatient) !== null && _d !== void 0 ? _d : '',
                        contactId: event.contactId,
                        hubspotAccountId: (_e = event.hubspotAccountId) !== null && _e !== void 0 ? _e : undefined,
                        implementation: (_f = event.implementation) !== null && _f !== void 0 ? _f : 'Transactional',
                        abandoned: (_g = event.abandoned) !== null && _g !== void 0 ? _g : 'No',
                        customParam: (_h = event.customParam) !== null && _h !== void 0 ? _h : 'nodata',
                        templateName: templateName_1
                    }).then(function (task) { return __awaiter(void 0, void 0, void 0, function () {
                        var participants;
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
                                    return [4 /*yield*/, client.conversations.v1.conversations(activeConversation_1).participants.list()];
                                case 2:
                                    participants = _a.sent();
                                    if (!(participants.length < 2)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, client.conversations.v1.conversations(activeConversation_1).update({
                                            state: 'closed'
                                        })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 7:
                _j.sent();
                returnObject = __assign(__assign({}, returnObject), { sid: msg.sid, body: msg.body });
                _j.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_1 = _j.sent();
                console.log(error_1);
                returnObject.result = 'ERROR';
                returnObject.error = error_1;
                return [2 /*return*/, callback(returnObject)];
            case 10:
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
                activeConversation = conversations.find(function (conversation) { return conversation.conversationState !== 'closed'; });
                if (activeConversation != undefined) {
                    return [2 /*return*/, activeConversation.conversationSid];
                }
                return [2 /*return*/, null];
        }
    });
}); };
var createNobodyTask = function (_a) {
    var context = _a.context, from = _a.from, conversationSid = _a.conversationSid, flowName = _a.flowName, name = _a.name, leadOrPatient = _a.leadOrPatient, contactId = _a.contactId, hubspotAccountId = _a.hubspotAccountId, implementation = _a.implementation, abandoned = _a.abandoned, customParam = _a.customParam, templateName = _a.templateName;
    return __awaiter(void 0, void 0, void 0, function () {
        var appointmentTypes, client, conversations, customers, hubspotClient, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    appointmentTypes = {
                        1: '1era visita',
                        2: '2da visita',
                        37: 'Ondas',
                        50: 'ATM',
                        55: 'TPS',
                        61: '2da recompra',
                        63: 'Urología',
                        66: 'Tele_O',
                        68: 'Valoración CVS',
                        69: 'Valoración Psx',
                        70: 'Bloqueada',
                        72: 'Piso Pélvico',
                        73: 'Nutrición',
                        74: 'Nutrición seguimiento',
                        76: 'Administrativa',
                        77: 'F/R',
                        78: 'Viaje',
                        79: 'OOC',
                        80: 'Cardiología',
                        81: 'Endocrina',
                        82: 'Intervención quirúrgica QX',
                        83: 'PRP'
                    };
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
                    conversations.conversation_label_3 = "Template Friendly name";
                    conversations.conversation_attribute_3 = templateName;
                    conversations.conversation_label_4 = "BOT implementation";
                    conversations.conversation_attribute_4 = implementation;
                    conversations.conversation_label_5 = "Tipo cita";
                    conversations.conversation_attribute_5 = appointmentTypes.hasOwnProperty(customParam) ? appointmentTypes[customParam] : customParam;
                    customers = {};
                    customers.customer_label_1 = "Lead or Patient";
                    customers.customer_attribute_1 = leadOrPatient;
                    customers.customer_label_2 = "URL Hubspot";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBBcHBvaW50bWVudERldGFpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaHVic3BvdC93b3JrZmxvd1NlbmRXaGF0c2FwcEFwcG9pbnRtZW50RGV0YWlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGtEQUE4RDtBQXVCOUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFFSSxJQUFNLE9BQU8sR0FBRyxVQUNuQixPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7OztnQkFHdEIsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztnQkFDakQsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUV2QywwREFBMEQ7Z0JBQzFELElBQUksQ0FBQyxVQUFVO29CQUFFLHNCQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUM7Z0JBRzVELEtBQTBCLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlDLFFBQVEsUUFBQSxFQUFFLFdBQVcsUUFBQSxDQUEwQjtnQkFDdEQsMkRBQTJEO2dCQUMzRCxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPO29CQUNsQyxzQkFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUkvQyxLQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUM7cUJBQzFELFFBQVEsRUFBRTtxQkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLEVBRlIsUUFBUSxRQUFBLEVBQUUsUUFBUSxRQUFBLENBRVQ7Z0JBQ2hCLHNFQUFzRTtnQkFDdEUsSUFBSSxRQUFRLEtBQUssT0FBTyxDQUFDLFdB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