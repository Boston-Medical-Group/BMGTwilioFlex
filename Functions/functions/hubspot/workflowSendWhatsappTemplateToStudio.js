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
                whatsappAddressTo_1 = phone.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(phone) : "".concat(phone);
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