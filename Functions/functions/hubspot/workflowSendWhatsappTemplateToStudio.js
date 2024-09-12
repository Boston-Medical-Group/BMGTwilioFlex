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
    var client, parameters, attributes, currentlyRequiredAttributes, returnObject, nestedError, hasError, phone, altphone, whatsappAddressTo_1, whatsappAddressFrom_1, activeConversation, timestamp, msg, templateName_1, error_1;
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
                hasError = false;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 12, , 13]);
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
                activeConversation = _g.sent();
                if (!(activeConversation === null)) return [3 /*break*/, 4];
                timestamp = (new Date).getTime();
                return [4 /*yield*/, client.conversations.v1.conversations.create({
                        friendlyName: "HubspotWorkflow -> ".concat(phone, " (").concat(timestamp, ")"),
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
                                                        var msg, templateName, isOk;
                                                        var _a, _b, _c, _d, _e, _f;
                                                        return __generator(this, function (_g) {
                                                            switch (_g.label) {
                                                                case 0:
                                                                    templateName = '';
                                                                    isOk = true;
                                                                    if (!event.message) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            body: event.message
                                                                        }).catch(function (err) { return __awaiter(void 0, void 0, void 0, function () {
                                                                            var _a;
                                                                            return __generator(this, function (_b) {
                                                                                hasError = true;
                                                                                isOk = false;
                                                                                nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 135');
                                                                                console.log('ERROR workflowSendWhatsappTemplateToStudio@136');
                                                                                console.log(err);
                                                                                return [2 /*return*/];
                                                                            });
                                                                        }); })];
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
                                                                        })];
                                                                case 3:
                                                                    _g.sent();
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            contentSid: event.template,
                                                                            contentVariables: JSON.stringify(parameters)
                                                                        }).catch(function (err) { return __awaiter(void 0, void 0, void 0, function () {
                                                                            var _a;
                                                                            return __generator(this, function (_b) {
                                                                                hasError = true;
                                                                                isOk = false;
                                                                                nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 151');
                                                                                console.log('ERROR workflowSendWhatsappTemplateToStudio@152');
                                                                                console.log(err);
                                                                                return [2 /*return*/];
                                                                            });
                                                                        }); })];
                                                                case 4:
                                                                    msg = _g.sent();
                                                                    _g.label = 5;
                                                                case 5:
                                                                    if (!isOk) return [3 /*break*/, 7];
                                                                    return [4 /*yield*/, createNobodyTask({
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
                                                                    return [3 /*break*/, 9];
                                                                case 7: return [4 /*yield*/, conversation.update({ state: "closed" })];
                                                                case 8:
                                                                    _g.sent();
                                                                    hasError = true;
                                                                    _g.label = 9;
                                                                case 9: return [2 /*return*/];
                                                            }
                                                        });
                                                    }); }).catch(function (err) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var _a;
                                                        return __generator(this, function (_b) {
                                                            switch (_b.label) {
                                                                case 0: return [4 /*yield*/, conversation.update({ state: "closed" })];
                                                                case 1:
                                                                    _b.sent();
                                                                    hasError = true;
                                                                    nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 182');
                                                                    console.log('ERROR workflowSendWhatsappTemplateToStudio@183');
                                                                    console.log(err);
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); })];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        });
                                    }); }).catch(function (err) { return __awaiter(void 0, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    // Si no se pudo agregar el participante a la conversación, se cierra la conversación
                                                    hasError = true;
                                                    return [4 /*yield*/, conversation.update({ state: "closed" })];
                                                case 1:
                                                    _b.sent();
                                                    nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 191');
                                                    console.log('ERROR workflowSendWhatsappTemplateToStudio@192');
                                                    console.log(err);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }).catch(function (err) {
                        var _a;
                        hasError = true;
                        nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 197');
                        console.log('ERROR workflowSendWhatsappTemplateToStudio@198');
                        console.log(err);
                    })];
            case 3:
                _g.sent();
                return [3 /*break*/, 11];
            case 4:
                msg = void 0;
                templateName_1 = '';
                if (!event.message) return [3 /*break*/, 6];
                return [4 /*yield*/, client.conversations.v1.conversations(activeConversation).messages.create({
                        body: event.message
                    }).catch(function (err) {
                        var _a;
                        hasError = true;
                        nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 210');
                        console.log('ERROR workflowSendWhatsappTemplateToStudio@211');
                        console.log(err);
                    })];
            case 5:
                //@ts-ignore
                msg = _g.sent();
                return [3 /*break*/, 9];
            case 6:
                if (!event.template) return [3 /*break*/, 9];
                // Sólo analitica
                return [4 /*yield*/, client.content.v1.contents(event.template)
                        .fetch()
                        .then(function (content) {
                        templateName_1 = content.friendlyName;
                    })];
            case 7:
                // Sólo analitica
                _g.sent();
                return [4 /*yield*/, client.conversations.v1.conversations(activeConversation).messages.create({
                        contentSid: event.template,
                        contentVariables: JSON.stringify(parameters)
                    }).catch(function (err) {
                        var _a;
                        hasError = true;
                        nestedError.push((_a = err.message) !== null && _a !== void 0 ? _a : 'NESTED ERROR: 227');
                        console.log('ERROR workflowSendWhatsappTemplateToStudio@228');
                        console.log(err);
                    })];
            case 8:
                msg = _g.sent();
                _g.label = 9;
            case 9: return [4 /*yield*/, createNobodyTask({
                    context: context,
                    from: whatsappAddressTo_1,
                    conversationSid: activeConversation,
                    flowSid: event.flowSid,
                    flowName: (_a = event.flowName) !== null && _a !== void 0 ? _a : 'Unknown Flow',
                    name: event.fullname,
                    leadOrPatient: (_b = event.leadOrPatient) !== null && _b !== void 0 ? _b : '',
                    contactId: event.contactId,
                    hubspotAccountId: (_c = event.hubspotAccountId) !== null && _c !== void 0 ? _c : undefined,
                    implementation: (_d = event.implementation) !== null && _d !== void 0 ? _d : 'Transactional',
                    abandoned: (_e = event.abandoned) !== null && _e !== void 0 ? _e : 'No',
                    customParam: (_f = event.customParam) !== null && _f !== void 0 ? _f : 'nodata',
                    templateName: templateName_1
                })];
            case 10:
                _g.sent();
                returnObject = __assign(__assign({}, returnObject), { sid: msg.sid, body: msg.body });
                _g.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_1 = _g.sent();
                hasError = true;
                console.log(error_1);
                returnObject.result = 'ERROR';
                returnObject.error = error_1;
                returnObject.nestedError = nestedError;
                return [3 /*break*/, 13];
            case 13:
                if (hasError) {
                    returnObject.result = 'ERROR';
                    returnObject.error = 'Internal logic error';
                    returnObject.nestedError = nestedError;
                    return [2 /*return*/, callback(returnObject)];
                }
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
                    /*
            // NO PUEDO HACER ESTO AÚN PORQUE UNA CONVERSACION CON 1 SOLO PARTICIPANTE PUEDE SER UNA CONFIRMACION DE CITA PREVIA
            
                    const participants = await client.conversations.v1.conversations(activeConversation.conversationSid).participants.list({})
                    if (participants.length < 2) {
                        await client.conversations.v1.conversations(activeConversation.conversationSid).update({ state: "closed" })
                    } else {
                        return activeConversation.conversationSid;
                    }*/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2h1YnNwb3Qvd29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQThEO0FBMkI5RDs7Ozs7Ozs7Ozs7OztHQWFHO0FBRUksSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCOzs7Ozs7Z0JBd0J0QixNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFBO2dCQUVwQyxVQUFVLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7cUJBQ3RDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUF4QixDQUF3QixDQUFDO3FCQUN2QyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsQ0FBQztvQkFDZCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDdkMsWUFBWTtvQkFDWixNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxPQUFPLE1BQU0sQ0FBQztnQkFDbEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUVOLFVBQVUsR0FBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7cUJBQzFELE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLEVBQTFDLENBQTBDLENB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