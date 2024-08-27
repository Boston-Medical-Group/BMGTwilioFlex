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
 * - contactId?
 * -
 * - phone
 * - objectId?
 * - objectType?
 * - param_*?
 *
 */
var handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, response, _a, authType, credentials, _b, username, password, client, parameters, phone, altphone, whatsappAddressTo, messagingService, messageOptions, error_1;
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
                if (!event.hasOwnProperty('template') && !event.hasOwnProperty('message')) {
                    return [2 /*return*/, callback(null, 'ERROR: Missing template or message')];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                phone = event.phone, altphone = event.altphone;
                phone = phone == '' ? altphone : phone;
                if (!phone || phone == undefined || phone == '') {
                    console.log('Invalid phone provided');
                    return [2 /*return*/, callback('Invalid phone provided')];
                }
                phone = phone.toString();
                whatsappAddressTo = phone.indexOf('whatsapp:') === -1 ? "whatsapp:".concat(phone) : "".concat(phone);
                messagingService = event.messagingService;
                messageOptions = {
                    from: messagingService,
                    to: whatsappAddressTo,
                };
                if (event.template) {
                    messageOptions.contentSid = event.template;
                    messageOptions.contentVariables = JSON.stringify(parameters);
                }
                else {
                    messageOptions.body = event.message;
                }
                return [4 /*yield*/, client.messages.create({
                        from: messagingService,
                        to: whatsappAddressTo,
                        contentSid: event.template,
                        contentVariables: JSON.stringify(parameters)
                    })];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3dTZW5kV2hhdHNhcHBUZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9odWJzcG90L3dvcmtmbG93U2VuZFdoYXRzYXBwVGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7Ozs7Ozs7R0FZRztBQUVJLElBQU0sT0FBTyxHQUFHLFVBQ25CLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0Qjs7Ozs7Z0JBR3RCLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7Z0JBQ2pELFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFFdkMsMERBQTBEO2dCQUMxRCxJQUFJLENBQUMsVUFBVTtvQkFBRSxzQkFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUc1RCxLQUEwQixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUE5QyxRQUFRLFFBQUEsRUFBRSxXQUFXLFFBQUEsQ0FBMEI7Z0JBQ3RELDJEQUEyRDtnQkFDM0QsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTztvQkFDbEMsc0JBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFJL0MsS0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDO3FCQUMxRCxRQUFRLEVBQUU7cUJBQ1YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUZSLFFBQVEsUUFBQSxFQUFFLFFBQVEsUUFBQSxDQUVUO2dCQUNoQixzRUFBc0U7Z0JBQ3RFLElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBQyxXQUFXLElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBQyxVQUFVO29CQUNuRSxzQkFB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