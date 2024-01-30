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
    var authHeader, response, _a, authType, credentials, _b, username, password, client, whatsappAddressTo_1, whatsappAddressFrom_1, timestamp, error_1;
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
                whatsappAddressTo_1 = event.phone.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(event.phone) : "".concat(event.phone);
                whatsappAddressFrom_1 = context.TWILIO_WA_PHONE_NUMBER.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(context.TWILIO_WA_PHONE_NUMBER) : "".concat(context.TWILIO_WA_PHONE_NUMBER);
                timestamp = (new Date).getTime();
                return [4 /*yield*/, client.conversations.v1.conversations.create({
                        friendlyName: "IATrainer -> ".concat(event.phone, " (").concat(timestamp, ")"),
                        attributes: JSON.stringify({
                            customerName: event.fullname,
                            name: event.fullname,
                            crmid: event.contact_id,
                            hubspot_contact_id: event.contact_id
                        })
                    }).then(function (conversation) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).participants.create({
                                        messagingBinding: {
                                            address: whatsappAddressTo_1,
                                            proxyAddress: whatsappAddressFrom_1
                                        }
                                    }).then(function (participant) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, client.conversations.v1.conversations(conversation.sid).webhooks.create({
                                                        target: 'studio',
                                                        configuration: {
                                                            flowSid: context.TWILIO_WA_IA_WORKFLOW
                                                        }
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
                                                                            contentSid: event.template
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBUb0lBVHJhaW5lci5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaHVic3BvdC93b3JrZmxvd1NlbmRXaGF0c2FwcFRvSUFUcmFpbmVyLnByb3RlY3RlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQk8sSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCOzs7OztnQkFHdEIsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztnQkFDakQsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUV2QywwREFBMEQ7Z0JBQzFELElBQUksQ0FBQyxVQUFVO29CQUFFLHNCQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUM7Z0JBRzVELEtBQTBCLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQTlDLFFBQVEsUUFBQSxFQUFFLFdBQVcsUUFBQSxDQUEwQjtnQkFDdEQsMkRBQTJEO2dCQUMzRCxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPO29CQUNsQyxzQkFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUkvQyxLQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUM7cUJBQzFELFFBQVEsRUFBRTtxQkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLEVBRlIsUUFBUSxRQUFBLEVBQUUsUUFBUSxRQUFBLENBRVQ7Z0JBQ2hCLHNFQUFzRTtnQkFDdEUsSUFBSSxRQUFRLEtBQUssT0FBTyxDQUFDLFdBQVcsSUFBSSxRQUFRLEtBQUssT0FBTyxDQUFDLFVBQVU7b0JBQ25F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