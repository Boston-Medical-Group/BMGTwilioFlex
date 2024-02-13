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
var api_client_1 = require("@hubspot/api-client");
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
    var hubspotClient, calendarUrl, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                if (event['calendar_url_field'] === undefined || event['calendar_url_field'] === '') {
                    event.calendar_url_field = 'reservar_cita';
                }
                calendarUrl = '';
                if (!(event.deal_id && event.deal_id !== '')) return [3 /*break*/, 2];
                return [4 /*yield*/, fetchCalendarUrlByDealId(context, hubspotClient, event.deal_id, event.calendar_url_field)];
            case 1:
                calendarUrl = _a.sent();
                return [3 /*break*/, 4];
            case 2:
                if (!(event.contact_id && event.contact_id !== '')) return [3 /*break*/, 4];
                return [4 /*yield*/, fetchCalendarUrlByContactId(context, hubspotClient, event.contact_id, event.calendar_url_field)];
            case 3:
                calendarUrl = _a.sent();
                _a.label = 4;
            case 4:
                response = new Twilio.Response();
                response.appendHeader("Access-Control-Allow-Origin", "*");
                response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                response.appendHeader("Content-Type", "application/json");
                response.setBody({ calendarUrl: calendarUrl });
                // Return a success response using the callback function.
                callback(null, response);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q2FsZW5kYXJVcmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZ2V0Q2FsZW5kYXJVcmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsa0RBQThEO0FBRzlELDJFQUFtRztBQUVuRyxJQUFNLDJCQUEyQixHQUFHLFVBQU8sT0FBZ0IsRUFBRSxNQUFxQixFQUFFLFNBQWlCLEVBQUUsZ0JBQXdCOzs7b0JBRXBILHFCQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7cUJBQzFFLElBQUksQ0FBQyxVQUFDLFFBQTRDO29CQUMvQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO3dCQUN4QyxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtvQkFDaEQsQ0FBQzt5QkFBTSxDQUFDO3dCQUNKLE9BQU8sSUFBSSxDQUFBO29CQUNmLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRztvQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNoQixPQUFPLElBQUksQ0FBQTtnQkFDZixDQUFDLENBQUMsRUFBQTtvQkFWTixzQkFBTyxTQVVELEVBQUE7OztLQUNULENBQUE7QUFFRCxJQUFNLHdCQUF3QixHQUFHLFVBQU8sT0FBZ0IsRUFBRSxNQUFxQixFQUFFLE1BQWMsRUFBRSxnQkFBd0I7OztvQkFDOUcscUJBQU0sTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztxQkFDcEUsSUFBSSxDQUFDLFVBQUMsUUFBNEM7b0JBQy9DLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7d0JBQ3hDLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO29CQUNoRCxDQUFDO3lCQUFNLENBQUM7d0JBQ0osT0FBTyxJQUFJLENBQUE7b0JBQ2YsQ0FBQztnQkFDTCxDQUFDLENBQUMsRUFBQTtvQkFQTixzQkFBTyxTQU9ELEVBQUE7OztLQUNULENBQUE7QUFZRCxZQUFZO0FBQ0MsUUFBQSxPQUFPLEdBQUcsSUFBQSwrQ0FBYyxFQUFDLFVBQU8sT0FBMkIsRUFBRSxLQUFjLEVBQUUsUUFBa0I7Ozs7O2dCQUVsRyxhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFBO2dCQUUvRSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztvQkFDbEYsS0FBSyxDQUFDLGtCQUFrQixHQUFHLGVBQWUsQ0FBQTtnQkFDOUMsQ0FBQztnQkFFRyxXQUFXLEdBQWtCLEVBQUUsQ0FBQTtxQkFDL0IsQ0FBQSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFBLEVBQXJDLHdCQUFxQztnQkFDdkIscUJBQU0sd0JBQXdCLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFBOztnQkFBN0csV0FBVyxHQUFHLFNBQStGLENBQUE7OztxQkFDdEcsQ0FBQSxLQUFLLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssRUFBRSxDQUFBLEVBQTNDLHdCQUEyQztnQkFDcEMscUJBQU0sMkJBQTJCLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFBOztnQkFBbkgsV0FBVyxHQUFHLFNBQXFHLENBQUE7OztnQkFJakgsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRCxRQUFRLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQzFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ3RFLFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQzFELFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxXQUFXLGFBQUEsRUFBRSxDQUFDLENBQUM7Z0JBRWxDLHlEQUF5RDtnQkFDekQsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzs7OztLQUM1QixDQUFDLENBQUEifQ==