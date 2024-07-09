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
    var authHeader, response, _a, authType, credentials, _b, username, password, client, parameters, attributes, currentlyRequiredAttributes, returnObject, whatsappAddressTo_1, whatsappAddressFrom_1, timestamp, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
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
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                whatsappAddressTo_1 = event.phone.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(event.phone) : "".concat(event.phone);
                whatsappAddressFrom_1 = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(context.TWILIO_WA_PHONE_NUMBER) : "".concat(context.TWILIO_WA_PHONE_NUMBER);
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
                                                                        })];
                                                                case 1:
                                                                    msg = _g.sent();
                                                                    return [3 /*break*/, 5];
                                                                case 2:
                                                                    if (!event.template) return [3 /*break*/, 5];
                                                                    return [4 /*yield*/, client.content.v1.contents(event.template)
                                                                            .fetch()
                                                                            .then(function (content) {
                                                                            templateName = content.friendlyName;
                                                                        })];
                                                                case 3:
                                                                    _g.sent();
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            contentSid: event.template,
                                                                            contentVariables: JSON.stringify(parameters)
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
                                                                        customParam: (_f = event.customParam) !== null && _f !== void 0 ? _f : '',
                                                                        templateName: templateName
                                                                    })];
                                                                case 6:
                                                                    _g.sent();
                                                                    returnObject = __assign(__assign({}, returnObject), msg);
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); })];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        });
                                    }); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
            case 2:
                _c.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.log(error_1);
                returnObject.result = 'ERROR';
                returnObject.error = error_1;
                return [3 /*break*/, 4];
            case 4:
                callback(null, returnObject);
                return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
var createNobodyTask = function (_a) {
    var context = _a.context, from = _a.from, conversationSid = _a.conversationSid, flowSid = _a.flowSid, flowName = _a.flowName, name = _a.name, leadOrPatient = _a.leadOrPatient, contactId = _a.contactId, hubspotAccountId = _a.hubspotAccountId, implementation = _a.implementation, abandoned = _a.abandoned, customParam = _a.customParam, templateName = _a.templateName;
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
                    conversations.conversation_label_2 = "Flow Sid";
                    conversations.conversation_attribute_2 = flowSid;
                    conversations.conversation_label_2 = "Flow Name";
                    conversations.conversation_attribute_2 = flowName;
                    conversations.conversation_label_3 = "Template Friendly name";
                    conversations.conversation_attribute_3 = templateName;
                    conversations.conversation_label_4 = "BOT implementation";
                    conversations.conversation_attribute_4 = implementation;
                    conversations.conversation_label_5 = "Tipo cita";
                    conversations.conversation_attribute_5 = customParam !== null && customParam !== void 0 ? customParam : '';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2h1YnNwb3Qvd29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQThEO0FBeUI5RDs7Ozs7Ozs7Ozs7OztHQWFHO0FBRUksSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCOzs7OztnQkFHdEIsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztnQkFDakQsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUV2QywwREFBMEQ7Z0JBQzFELElBQUksQ0FBQyxVQUFVO29CQUFFLHNCQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUM7Z0JBRzVELEtBQTBCLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlDLFFBQVEsUUFBQSxFQUFFLFdBQVcsUUFBQSxDQUEwQjtnQkFDdEQsMkRBQTJEO2dCQUMzRCxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPO29CQUNsQyxzQkFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUkvQyxLQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUM7cUJBQzFELFFBQVEsRUFBRTtxQkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLEVBRlIsUUFBUSxRQUFBLEVBQUUsUUFBUSxRQUFBLENBRVQ7Z0JBQ2hCLHNFQUFzRTtnQkFDdEUsSUFBSSxRQUFRLEtBQUssT0FBTyxDQUFDLFdBQVcs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