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
var api_client_1 = require("@hubspot/api-client");
var optoput = require(Runtime.getFunctions()['helpers/optout'].path);
var doOptInOrOut = function (context, event, optIn) { return __awaiter(void 0, void 0, void 0, function () {
    var author, hubspotClient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!event.Source || event.Source.toUpperCase() !== "WHATSAPP") {
                    return [2 /*return*/];
                }
                author = event.Author;
                if (author.startsWith('whatsapp:')) {
                    author = author.slice(9);
                }
                hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                return [4 /*yield*/, hubspotClient.crm.contacts.searchApi.doSearch({
                        query: author,
                        filterGroups: [],
                        sorts: ['phone'],
                        properties: ['firstname', 'lastname', 'hubspot_owner_id'],
                        limit: 5,
                        after: 0
                    }).then(function (contacts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(contacts.total > 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, hubspotClient.crm.contacts.batchApi.update({
                                            inputs: contacts.results.map(function (contact) {
                                                return {
                                                    id: contact.id,
                                                    properties: {
                                                        'whatsappoptout': optIn ? 'false' : 'true'
                                                    }
                                                };
                                            })
                                        }).then(function () {
                                            console.log('Success');
                                        }).catch(function (err) {
                                            console.log(err);
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/, null];
                            }
                        });
                    }); }).catch(function (err) {
                        console.log(err);
                        return null;
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Comprueba si el mensaje es un opt-out de WhatsApp y lo excluye
 */
var checkOptOut = function (context, event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, doOptInOrOut(context, event, false)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Comprueba si el mensaje es un opt-in de whatsapp y lo inscribe en hubspot
 * @param context
 * @param event
 */
var checkOptIn = function (context, event) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, doOptInOrOut(context, event, true)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
//@ts-ignore
var handler = function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(event.EventType === "onMessageAdded")) return [3 /*break*/, 4];
                    if (!event.OptOutType) return [3 /*break*/, 4];
                    if (!(event.OptOutType.toLowerCase() === 'stop')) return [3 /*break*/, 2];
                    return [4 /*yield*/, checkOptOut(context, event)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!(event.OptOutType.toLowerCase() === 'start')) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkOptIn(context, event)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    callback(null);
                    return [2 /*return*/];
            }
        });
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJzYXRpb24vd2ViaG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBOEQ7QUFLOUQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBb0J2RSxJQUFNLFlBQVksR0FBRyxVQUFPLE9BQTJCLEVBQUUsS0FBYyxFQUFFLEtBQWM7Ozs7O2dCQUNuRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLFVBQVUsRUFBRTtvQkFDNUQsc0JBQU07aUJBQ1Q7Z0JBR0csTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7Z0JBQ3pCLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDaEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVCO2dCQUdLLGFBQWEsR0FBRyxJQUFJLG1CQUFhLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7Z0JBQy9FLHFCQUFNLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7d0JBQ2hELEtBQUssRUFBRSxNQUFNO3dCQUNiLFlBQVksRUFBRSxFQUFFO3dCQUNoQixLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUM7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLENBQUM7d0JBQ3pELEtBQUssRUFBRSxDQUFDO3dCQUNSLEtBQUssRUFBRSxDQUFDO3FCQUNYLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFB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