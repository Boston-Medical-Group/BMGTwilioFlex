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
var handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, response, _a, authType, credentials, _b, username, password, client, phone, altphone, whatsappAddressTo_1, whatsappAddressFrom_1, timestamp, error_1;
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
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                phone = event.phone, altphone = event.altphone;
                phone = phone == '' ? altphone : phone;
                if (!phone || phone == undefined || phone == '') {
                    console.log('Invalid phone provided');
                    return [2 /*return*/, callback('Invalid phone provided')];
                }
                whatsappAddressTo_1 = phone.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(phone) : "".concat(phone);
                whatsappAddressFrom_1 = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(context.TWILIO_WA_PHONE_NUMBER) : "".concat(context.TWILIO_WA_PHONE_NUMBER);
                timestamp = (new Date).getTime();
                return [4 /*yield*/, client.conversations.v1.conversations.create({
                        friendlyName: "IATrainer -> ".concat(phone, " (").concat(timestamp, ")"),
                        attributes: JSON.stringify({
                            customerName: event.fullname,
                            name: event.fullname,
                            crmid: event.contact_id,
                            hubspot_contact_id: event.contact_id
                        }),
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
                                                        "configuration.flowSid": context.TWILIO_WA_IA_STUDIO_FLOW
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
                                                                            contentVariables: JSON.stringify({
                                                                                agentfirstname: event.agentfirstname,
                                                                                agentlastname: event.agentlastname,
                                                                                contactfirstname: event.firstname,
                                                                                contactlastname: event.lastname
                                                                            })
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
                callback('ERROR');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBUb0lBVHJhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odWJzcG90L3dvcmtmbG93U2VuZFdoYXRzYXBwVG9JQVRyYWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJPLElBQU0sT0FBTyxHQUFHLFVBQ25CLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0Qjs7Ozs7Z0JBR3RCLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQ2pELFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFFdkMsMERBQTBEO2dCQUMxRCxJQUFJLENBQUMsVUFBVTtvQkFBRSxzQkFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUc1RCxLQUEwQixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QyxRQUFRLFFBQUEsRUFBRSxXQUFXLFFBQUEsQ0FBMEI7Z0JBQ3RELDJEQUEyRDtnQkFDM0QsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTztvQkFDbEMsc0JBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFJL0MsS0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDO3FCQUMxRCxRQUFRLEVBQUU7cUJBQ1YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUZSLFFBQVEsUUFBQSxFQUFFLFFBQVEsUUFBQSxDQUVUO2dCQUNoQixzRUFBc0U7Z0JBQ3RFLElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBQyxXQUFXLElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBQyxVQUFVO29CQUNuRSxzQkFBTyxRQUFRLENBQUMsSUFB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