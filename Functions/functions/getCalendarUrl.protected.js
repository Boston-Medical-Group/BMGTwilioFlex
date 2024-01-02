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
//export const handler = TokenValidator(async (context: Context<MyContext>, event: MyEvent, callback: Callback) => {
var handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
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
}); };
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q2FsZW5kYXJVcmwucHJvdGVjdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2dldENhbGVuZGFyVXJsLnByb3RlY3RlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxrREFBOEQ7QUFLOUQsSUFBTSwyQkFBMkIsR0FBRyxVQUFPLE9BQWdCLEVBQUUsTUFBcUIsRUFBRSxTQUFpQixFQUFFLGdCQUF3Qjs7O29CQUVwSCxxQkFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3FCQUMxRSxJQUFJLENBQUMsVUFBQyxRQUE0QztvQkFDL0MsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7d0JBQ3ZDLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO3FCQUMvQzt5QkFBTTt3QkFDSCxPQUFPLElBQUksQ0FBQTtxQkFDZDtnQkFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHO29CQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBQ2hCLE9BQU8sSUFBSSxDQUFBO2dCQUNmLENBQUMsQ0FBQyxFQUFBO29CQVZOLHNCQUFPLFNBVUQsRUFBQTs7O0tBQ1QsQ0FBQTtBQUVELElBQU0sd0JBQXdCLEdBQUcsVUFBTyxPQUFnQixFQUFFLE1BQXFCLEVBQUUsTUFBYyxFQUFFLGdCQUF3Qjs7O29CQUM5RyxxQkFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3FCQUNwRSxJQUFJLENBQUMsVUFBQyxRQUE0QztvQkFDL0MsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7d0JBQ3ZDLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO3FCQUMvQzt5QkFBTTt3QkFDSCxPQUFPLElBQUksQ0FBQTtxQkFDZDtnQkFDTCxDQUFDLENBQUMsRUFBQTtvQkFQTixzQkFBTyxTQU9ELEVBQUE7OztLQUNULENBQUE7QUFZRCxZQUFZO0FBQ1osb0hBQW9IO0FBQzdHLElBQU0sT0FBTyxHQUFHLFVBQU8sT0FBMkIsRUFBRSxLQUFjLEVBQUUsUUFBa0I7Ozs7O2dCQUNuRixhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFBO2dCQUUvRSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ2pGLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxlQUFlLENBQUE7aUJBQzdDO2dCQUVHLFdBQVcsR0FBa0IsRUFBRSxDQUFBO3FCQUMvQixDQUFBLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUEsRUFBckMsd0JBQXFDO2dCQUN2QixxQkFBTSx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUE7O2dCQUE3RyxXQUFXLEdBQUcsU0FBK0YsQ0FBQTs7O3FCQUN0RyxDQUFBLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxFQUFFLENBQUEsRUFBM0Msd0JBQTJDO2dCQUNwQyxxQkFBTSwyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUE7O2dCQUFuSCxXQUFXLEdBQUcsU0FBcUcsQ0FBQTs7O2dCQUdqSCxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZDLFFBQVEsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzFELFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDMUUsUUFBUSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFFdEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDMUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFdBQVcsYUFBQSxFQUFFLENBQUMsQ0FBQztnQkFFbEMseURBQXlEO2dCQUN6RCxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7O0tBRTVCLENBQUE7QUF6QlksUUFBQSxPQUFPLFdBeUJuQiJ9