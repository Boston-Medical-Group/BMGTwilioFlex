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
                                                        var msg;
                                                        var _a, _b, _c, _d, _e;
                                                        return __generator(this, function (_f) {
                                                            switch (_f.label) {
                                                                case 0:
                                                                    if (!event.message) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            body: event.message
                                                                        })];
                                                                case 1:
                                                                    msg = _f.sent();
                                                                    return [3 /*break*/, 4];
                                                                case 2:
                                                                    if (!event.template) return [3 /*break*/, 4];
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            contentSid: event.template,
                                                                            contentVariables: JSON.stringify(parameters)
                                                                        })];
                                                                case 3:
                                                                    msg = _f.sent();
                                                                    _f.label = 4;
                                                                case 4: return [4 /*yield*/, createNobodyTask({
                                                                        context: context,
                                                                        from: whatsappAddressFrom_1,
                                                                        conversationSid: conversation.sid,
                                                                        flowSid: event.flowSid,
                                                                        flowName: (_a = event.flowName) !== null && _a !== void 0 ? _a : 'Unknown Flow',
                                                                        name: event.fullname,
                                                                        leadOrPatient: (_b = event.leadOrPatient) !== null && _b !== void 0 ? _b : '',
                                                                        contactId: event.contactId,
                                                                        hubspotAccountId: (_c = event.hubspotAccountId) !== null && _c !== void 0 ? _c : undefined,
                                                                        implementation: (_d = event.implementation) !== null && _d !== void 0 ? _d : 'Transactional',
                                                                        abandoned: (_e = event.abandoned) !== null && _e !== void 0 ? _e : 'No'
                                                                    })];
                                                                case 5:
                                                                    _f.sent();
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
    var context = _a.context, from = _a.from, conversationSid = _a.conversationSid, flowSid = _a.flowSid, flowName = _a.flowName, name = _a.name, leadOrPatient = _a.leadOrPatient, contactId = _a.contactId, hubspotAccountId = _a.hubspotAccountId, implementation = _a.implementation, abandoned = _a.abandoned;
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
                    conversations.communication_channel = "Chat";
                    conversations.conversation_label_1 = "Conversation Sid";
                    conversations.conversation_attribute_1 = conversationSid;
                    conversations.conversation_label_2 = "Flow Sid";
                    conversations.conversation_attribute_2 = flowSid;
                    conversations.conversation_label_2 = "Flow Name";
                    conversations.conversation_attribute_2 = flowName;
                    conversations.conversation_label_4 = "BOT implementation";
                    conversations.conversation_attribute_4 = implementation;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2h1YnNwb3Qvd29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQThEO0FBd0I5RDs7Ozs7Ozs7Ozs7O0dBWUc7QUFFSSxJQUFNLE9BQU8sR0FBRyxVQUNuQixPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7O2dCQUd0QixVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUNqRCxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRXZDLDBEQUEwRDtnQkFDMUQsSUFBSSxDQUFDLFVBQVU7b0JBQUUsc0JBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFHNUQsS0FBMEIsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUMsUUFBUSxRQUFBLEVBQUUsV0FBVyxRQUFBLENBQTBCO2dCQUN0RCwyREFBMkQ7Z0JBQzNELElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLE9BQU87b0JBQ2xDLHNCQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUM7Z0JBSS9DLEtBQXVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQztxQkFDMUQsUUFBUSxFQUFFO3FCQUNWLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFGUixRQUFRLFFBQUEsRUFBRSxRQUFRLFFBQUEsQ0FFVDtnQkFDaEIsc0VBQXNFO2dCQUN0RSxJQUFJLFFBQVEsS0FBSyxPQUFPLENBQUMsV0FBVyxJ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