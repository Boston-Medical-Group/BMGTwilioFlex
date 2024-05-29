"use strict";
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
    var authHeader, response, _a, authType, credentials, _b, username, password, client, parameters, attributes, currentlyRequiredAttributes, whatsappAddressTo_1, whatsappAddressFrom_1, timestamp, error_1;
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
                    .filter(function (k) { return k.indexOf('param_') != 0; })
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
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    if (!event.message) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            body: event.message
                                                                        })];
                                                                case 1: return [2 /*return*/, _a.sent()];
                                                                case 2:
                                                                    if (!event.template) return [3 /*break*/, 4];
                                                                    return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).messages.create({
                                                                            contentSid: event.template,
                                                                            contentVariables: JSON.stringify(parameters)
                                                                        })];
                                                                case 3: return [2 /*return*/, _a.sent()];
                                                                case 4: return [2 /*return*/];
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
                callback(null, 'OK');
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.log(error_1);
                callback(null, 'ERROR');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
var setUnauthorized = function (response) {
    response
        .setBody('Unauthorized')
        .setStatusCode(401)
        .appendHeader('WWW-Authenticate', 'Basic realm="Authentication Required"');
    return response;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2h1YnNwb3Qvd29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZVRvU3R1ZGlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7Ozs7Ozs7O0dBWUc7QUFFSSxJQUFNLE9BQU8sR0FBRyxVQUNuQixPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7O2dCQUd0QixVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUNqRCxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRXZDLDBEQUEwRDtnQkFDMUQsSUFBSSxDQUFDLFVBQVU7b0JBQUUsc0JBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFHNUQsS0FBMEIsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBOUMsUUFBUSxRQUFBLEVBQUUsV0FBVyxRQUFBLENBQTBCO2dCQUN0RCwyREFBMkQ7Z0JBQzNELElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLE9BQU87b0JBQ2xDLHNCQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUM7Z0JBSS9DLEtBQXVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQztxQkFDMUQsUUFBUSxFQUFFO3FCQUNWLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFGUixRQUFRLFFBQUEsRUFBRSxRQUFRLFFBQUEsQ0FFVDtnQkFDaEIsc0VBQXNFO2dCQUN0RSxJQUFJLFFBQVEsS0FBSyxPQUFPLENBQUMsV0FBVyxJQUFJLFFBQVEsS0FBSyxPQUFPLENBQUMs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