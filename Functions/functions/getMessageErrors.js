"use strict";
/**
 * Obtiene la URL de reservar_cita de la API de Hubspot
 * según el contacto o el negocio activo.
 */
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
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
var fetchCalendarUrlByContactId = function (context, client, contactId, calendarUrlField) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.crm.contacts.basicApi.getById(contactId, ['reservar_cita'])
                    .then(function (response) {
                    if (response.properties[calendarUrlField]) {
                        return response.properties[calendarUrlField];
                    }
                    else {
                        return null;
                    }
                }).catch(function (err) {
                    console.log(err);
                    return null;
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var fetchCalendarUrlByDealId = function (context, client, dealId, calendarUrlField) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.crm.deals.basicApi.getById(dealId, ['reservar_cita'])
                    .then(function (response) {
                    if (response.properties[calendarUrlField]) {
                        return response.properties[calendarUrlField];
                    }
                    else {
                        return null;
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, client, err_1, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = [];
                client = context.getTwilioClient();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.conversations.v1.conversations(event.conversationSid).messages.list({
                        limit: 1,
                        order: 'desc'
                    }).then(function (messages) { return __awaiter(void 0, void 0, void 0, function () {
                        var message, receipts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(messages.length > 0)) return [3 /*break*/, 2];
                                    message = messages[0];
                                    receipts = message.deliveryReceipts();
                                    return [4 /*yield*/, receipts.list({})
                                            .then(function (deliveryReceipts) { return __awaiter(void 0, void 0, void 0, function () {
                                            var codes;
                                            return __generator(this, function (_a) {
                                                codes = [];
                                                deliveryReceipts.forEach(function (deliveryReceipt) {
                                                    if (deliveryReceipt.errorCode !== null) {
                                                        codes.push({
                                                            date: deliveryReceipt.dateCreated,
                                                            code: deliveryReceipt.errorCode
                                                        });
                                                    }
                                                });
                                                errors.push.apply(errors, codes);
                                                return [2 /*return*/];
                                            });
                                        }); })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4:
                response = new Twilio.Response();
                response.appendHeader("Access-Control-Allow-Origin", "*");
                response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                response.appendHeader("Content-Type", "application/json");
                response.setBody(errors);
                // Return a success response using the callback function.
                callback(null, response);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TWVzc2FnZUVycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXRNZXNzYWdlRXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1ILDJFQUFtRztBQUluRyxJQUFNLDJCQUEyQixHQUFHLFVBQU8sT0FBZ0IsRUFBRSxNQUFxQixFQUFFLFNBQWlCLEVBQUUsZ0JBQXdCOzs7b0JBRXBILHFCQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7cUJBQzFFLElBQUksQ0FBQyxVQUFDLFFBQTRDO29CQUMvQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRTt3QkFDdkMsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUE7cUJBQy9DO3lCQUFNO3dCQUNILE9BQU8sSUFBSSxDQUFBO3FCQUNkO2dCQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUc7b0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDaEIsT0FBTyxJQUFJLENBQUE7Z0JBQ2YsQ0FBQyxDQUFDLEVBQUE7b0JBVk4sc0JBQU8sU0FVRCxFQUFBOzs7S0FDVCxDQUFBO0FBRUQsSUFBTSx3QkFBd0IsR0FBRyxVQUFPLE9BQWdCLEVBQUUsTUFBcUIsRUFBRSxNQUFjLEVBQUUsZ0JBQXdCOzs7b0JBQzlHLHFCQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7cUJBQ3BFLElBQUksQ0FBQyxVQUFDLFFBQTRDO29CQUMvQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdC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