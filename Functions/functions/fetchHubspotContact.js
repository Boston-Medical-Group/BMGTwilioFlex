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
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
var api_client_1 = require("@hubspot/api-client");
var fetchByContact = function (contact_id, context, deal) { return __awaiter(void 0, void 0, void 0, function () {
    var hubspotClient, contact;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                return [4 /*yield*/, hubspotClient.crm.contacts.basicApi.getById(contact_id, ['email', 'firstname', 'lastname', 'phone', 'hs_object_id', 'reservar_cita', 'country', 'donotcall', 'numero_de_telefono_adicional', 'numero_de_telefono_adicional_'])
                        .then(function (hubpostContact) { return hubpostContact; })
                        .catch(function (error) {
                        throw new Error('Error while retrieving data from hubspot (CONTACT)');
                    })];
            case 1:
                contact = _a.sent();
                return [2 /*return*/, __assign(__assign({}, contact), { deal: deal !== null && deal !== void 0 ? deal : null })];
        }
    });
}); };
var fetchByDeal = function (deal_id, context) { return __awaiter(void 0, void 0, void 0, function () {
    var hubspotClient, deal, contacts, contactAssociation;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                return [4 /*yield*/, hubspotClient.crm.deals.basicApi.getById(deal_id, ['dealname', 'dealstage', 'hs_object_id', 'reservar_cita'], [], ['contact']).then(function (hubspotDeal) { return hubspotDeal; })
                        .catch(function (error) {
                        throw new Error('Error while retrieving data from hubspot (DEAL)');
                    })];
            case 1:
                deal = _b.sent();
                contacts = ((_a = deal.associations) === null || _a === void 0 ? void 0 : _a.contacts) ? deal.associations.contacts.results : [];
                if (!(contacts.length > 0)) return [3 /*break*/, 3];
                contactAssociation = contacts[0];
                return [4 /*yield*/, fetchByContact(contactAssociation.id, context, deal)];
            case 2: return [2 /*return*/, _b.sent()];
            case 3: throw new Error('Error while retrieving data from hubspot (DEALCONTACT)');
        }
    });
}); };
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var contact_id, deal_id, response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contact_id = event.contact_id, deal_id = event.deal_id;
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    data = void 0;
                    if (!contact_id) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetchByContact(contact_id, context)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 6];
                case 3:
                    if (!deal_id) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchByDeal(deal_id, context)];
                case 4:
                    data = _a.sent();
                    return [3 /*break*/, 6];
                case 5: throw new Error('CONTACT ID (contact_id) o DEAL ID Inválidos');
                case 6:
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody(data);
                    // Return a success response using the callback function.
                    callback(null, response);
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        response.appendHeader("Content-Type", "plain/text");
                        response.setBody(err_1.message);
                        response.setStatusCode(500);
                        // If there's an error, send an error response
                        // Keep using the response object for CORS purposes
                        console.error(err_1);
                        callback(null, response);
                    }
                    else {
                        callback(null, {});
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hIdWJzcG90Q29udGFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mZXRjaEh1YnNwb3RDb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyRUFBMEY7QUFDMUYsa0RBQTZEO0FBUzdELElBQU0sY0FBYyxHQUFHLFVBQU8sVUFBa0IsRUFBRSxPQUEyQixFQUFFLElBQTZDOzs7OztnQkFDcEgsYUFBYSxHQUFHLElBQUksbUJBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtnQkFDcEIscUJBQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FDMUcsVUFBVSxFQUNWLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSw4QkFBOEIsRUFBRSwrQkFBK0IsQ0FBQyxDQUN0Szt5QkFDRSxJQUFJLENBQUMsVUFBQyxjQUF5RCxJQUFLLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQzt5QkFDbkYsS0FBSyxDQUFDLFVBQUMsS0FBSzt3QkFDWCxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7b0JBQ3hFLENBQUMsQ0FBQyxFQUFBOztnQkFQRSxPQUFPLEdBQThDLFNBT3ZEO2dCQUVKLDRDQUNLLE9BQU8sS0FDVixJQUFJLEVBQUUsSUFBSSxhQUFKLElBQUksY0FBSixJQUFJLEdBQUksSUFBSSxLQUNuQjs7O0tBQ0YsQ0FBQTtBQUVELElBQU0sV0FBVyxHQUFHLFVBQU8sT0FBZSxFQUFFLE9BQTJCOzs7Ozs7Z0JBQy9ELGFBQWEsR0FBRyxJQUFJLG1CQUFhLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxD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