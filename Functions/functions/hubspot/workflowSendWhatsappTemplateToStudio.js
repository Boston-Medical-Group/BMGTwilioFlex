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
 * - message?
 * - flowSid
 * - contactId?
 * - phone
 * - objectId?
 * - objectType?
 * - param_*?
 * - customParam?
 *
 */
var handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, response, _a, authType, credentials, _b, username, password, client, parameters, attributes, currentlyRequiredAttributes, returnObject, nestedError, whatsappAddressTo_1, whatsappAddressFrom_1, activeConversation, timestamp, msg, templateName_1, error_1;
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
                nestedError = [];
                _j.label = 1;
            case 1:
                _j.trys.push([1, 12, , 13]);
                whatsappAddressTo_1 = event.phone.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(event.phone) : "".concat(event.phone);
                whatsappAddressFrom_1 = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(context.TWILIO_WA_PHONE_NUMBER) : "".concat(context.TWILIO_WA_PHONE_NUMBER);
                return [4 /*yield*/, getActiveConversation(context, whatsappAddressTo_1)];
            case 2:
                activeConversation = _j.sent();
                if (!(activeConversation === null)) return [3 /*break*/, 4];
                timestamp = (new Date).getTime();
                return [4 /*yield*/, client.conversations.v1.conversations.create({
                        friendlyName: "HubspotWorkflow -> ".concat(event.phone, " (").concat(timestamp, ")"),
                        attributes: JSON.stringify(attributes),
                        timers: {
                            inactive: 'PT1H',
                            closed: 'PT24H'
                        }
                    }).then(function (conversation) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).participants.create({
                                        //@ts-ignore
                                        "messagingBinding.address": whatsappAddressTo_1,
                                        "messagingBinding.proxyAddress": whatsappAddressFrom_1
                                    }).then(function (participant) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).webhooks.create({
                                                        target: 'studio',
                                                        //@ts-ignore
                                                        "configuration.flowSid": event.flowSid
                                                    }).then(function (webhook) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var msg, templateName;
                                                        var _a, _b, _c, _d, _e, _f;
                                                        return __generator(this, function (_g) {
                                                            switch (_g.label) {
                                                                case 0:
                                                                    templateName = '';
                                                                    if (!event.message) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            body: event.message
                                                                        }).catch(function (err) {
                                                                            var _a;
                                                                            nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 133');
                                                                            console.log('ERROR workflowSendWhatsappTemplateToStudio@134');
                                                                            console.log(err);
                                                                        })];
                                                                case 1:
                                                                    //@ts-ignore
                                                                    msg = _g.sent();
                                                                    return [3 /*break*/, 5];
                                                                case 2:
                                                                    if (!event.template) return [3 /*break*/, 5];
                                                                    return [4 /*yield*/, client.content.v1.contents(event.template)
                                                                            .fetch()
                                                                            .then(function (content) {
                                                                            templateName = content.friendlyName;
                                                                        })
                                                                            .catch(function (err) {
                                                                            var _a;
                                                                            nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 144');
                                                                            console.log('ERROR workflowSendWhatsappTemplateToStudio@145');
                                                                            console.log(err);
                                                                        })];
                                                                case 3:
                                                                    _g.sent();
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            contentSid: event.template,
                                                                            contentVariables: JSON.stringify(parameters)
                                                                        }).catch(function (err) {
                                                                            var _a;
                                                                            nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 153');
                                                                            console.log('ERROR workflowSendWhatsappTemplateToStudio@154');
                                                                            console.log(err);
                                                                        })];
                                                                case 4:
                                                                    msg = _g.sent();
                                                                    _g.label = 5;
                                                                case 5: return [4 /*yield*/, createNobodyTask({
                                                                        context: context,
                                                                        from: whatsappAddressTo_1,
                                                                        conversationSid: conversation.sid,
                                                                        flowSid: event.flowSid,
                                                                        flowName: (_a = event.flowName) !== null && _a !== void 0 ? _a : 'Unknown Flow',
                                                                        name: event.fullname,
                                                                        leadOrPatient: (_b = event.leadOrPatient) !== null && _b !== void 0 ? _b : '',
                                                                        contactId: event.contactId,
                                                                        hubspotAccountId: (_c = event.hubspotAccountId) !== null && _c !== void 0 ? _c : undefined,
                                                                        implementation: (_d = event.implementation) !== null && _d !== void 0 ? _d : 'Transactional',
                                                                        abandoned: (_e = event.abandoned) !== null && _e !== void 0 ? _e : 'No',
                                                                        customParam: (_f = event.customParam) !== null && _f !== void 0 ? _f : 'nodata',
                                                                        templateName: templateName
                                                                    })];
                                                                case 6:
                                                                    _g.sent();
                                                                    returnObject = __assign(__assign({}, returnObject), { sid: msg.sid, body: msg.body });
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); }).catch(function (err) {
                                                        var _a;
                                                        nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 181');
                                                        console.log('ERROR workflowSendWhatsappTemplateToStudio@182');
                                                        console.log(err);
                                                    })];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        });
                                    }); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }).catch(function (err) {
                        var _a;
                        nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 187');
                        console.log('ERROR workflowSendWhatsappTemplateToStudio@188');
                        console.log(err);
                    })];
            case 3:
                _j.sent();
                return [3 /*break*/, 11];
            case 4:
                msg = void 0;
                templateName_1 = '';
                if (!event.message) return [3 /*break*/, 6];
                return [4 /*yield*/, client.conversations.v1.conversations(activeConversation).messages.create({
                        body: event.message
                    }).catch(function (err) {
                        var _a;
                        nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 199');
                        console.log('ERROR workflowSendWhatsappTemplateToStudio@200');
                        console.log(err);
                    })];
            case 5:
                //@ts-ignore
                msg = _j.sent();
                return [3 /*break*/, 9];
            case 6:
                if (!event.template) return [3 /*break*/, 9];
                return [4 /*yield*/, client.content.v1.contents(event.template)
                        .fetch()
                        .then(function (content) {
                        templateName_1 = content.friendlyName;
                    }).catch(function (err) {
                        var _a;
                        nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 209');
                        console.log('ERROR workflowSendWhatsappTemplateToStudio@210');
                        console.log(err);
                    })];
            case 7:
                _j.sent();
                return [4 /*yield*/, client.conversations.v1.conversations(activeConversation).messages.create({
                        contentSid: event.template,
                        contentVariables: JSON.stringify(parameters)
                    }).catch(function (err) {
                        var _a;
                        nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 218');
                        console.log('ERROR workflowSendWhatsappTemplateToStudio@219');
                        console.log(err);
                    })];
            case 8:
                msg = _j.sent();
                _j.label = 9;
            case 9: return [4 /*yield*/, createNobodyTask({
                    context: context,
                    from: whatsappAddressTo_1,
                    conversationSid: activeConversation,
                    flowSid: event.flowSid,
                    flowName: (_c = event.flowName) !== null && _c !== void 0 ? _c : 'Unknown Flow',
                    name: event.fullname,
                    leadOrPatient: (_d = event.leadOrPatient) !== null && _d !== void 0 ? _d : '',
                    contactId: event.contactId,
                    hubspotAccountId: (_e = event.hubspotAccountId) !== null && _e !== void 0 ? _e : undefined,
                    implementation: (_f = event.implementation) !== null && _f !== void 0 ? _f : 'Transactional',
                    abandoned: (_g = event.abandoned) !== null && _g !== void 0 ? _g : 'No',
                    customParam: (_h = event.customParam) !== null && _h !== void 0 ? _h : 'nodata',
                    templateName: templateName_1
                })];
            case 10:
                _j.sent();
                returnObject = __assign(__assign({}, returnObject), { sid: msg.sid, body: msg.body });
                _j.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_1 = _j.sent();
                console.log(error_1);
                returnObject.result = 'ERROR';
                returnObject.error = error_1;
                returnObject.nestedError = nestedError;
                return [3 /*break*/, 13];
            case 13:
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
    var context = _a.context, from = _a.from, conversationSid = _a.conversationSid, flowSid = _a.flowSid, flowName = _a.flowName, name = _a.name, leadOrPatient = _a.leadOrPatient, contactId = _a.contactId, hubspotAccountId = _a.hubspotAccountId, implementation = _a.implementation, abandoned = _a.abandoned, customParam = _a.customParam, templateName = _a.templateName;
    return __awaiter(void 0, void 0, void 0, function () {
        var client, appointmentTypes, conversations, customers, hubspotClient, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = context.getTwilioClient();
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
                    conversations.conversation_label_2 = "Flow Sid";
                    conversations.conversation_attribute_2 = flowSid;
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
                    return [4 /*yield*/, client.taskrouter.v1
                            .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                            .tasks.create({
                            attributes: JSON.stringify({ "from": from, "name": name, conversations: conversations, customers: customers }),
                            workflowSid: context.TASK_ROUTER_NOBODY_WORKFLOW_SID,
                            timeout: 86400
                        })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2h1YnNwb3Qvd29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQThEO0FBMEI5RDs7Ozs7Ozs7Ozs7OztHQWFHO0FBRUksSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCOzs7Ozs7Z0JBR3RCLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQ2pELFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFFdkMsMERBQTBEO2dCQUMxRCxJQUFJLENBQUMsVUFBVTtvQkFBRSxzQkFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUc1RCxLQUEwQixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QyxRQUFRLFFBQUEsRUFBRSxXQUFXLFFBQUEsQ0FBMEI7Z0JBQ3RELDJEQUEyRDtnQkFDM0QsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTztvQkFDbEMsc0JBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFJL0MsS0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDO3FCQUMxRCxRQUFRLEVBQUU7cUJBQ1YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUZSLFFBQVEsUUFBQSxFQUFFLFFBQVEsUUFBQSxDQUVUO2dCQUNoQixzRUFBc0U7Z0JBQ3RFLElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBQyxXQUFX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