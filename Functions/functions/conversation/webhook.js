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
var doOptInOrOut = function (context, event, author, optIn) { return __awaiter(void 0, void 0, void 0, function () {
    var hubspotClient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
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
    var author;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!event.OptOutType) {
                    return [2 /*return*/];
                }
                author = event.From;
                if (author.startsWith('whatsapp:')) {
                    author = author.slice(9);
                }
                return [4 /*yield*/, doOptInOrOut(context, event, author, false)];
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
    var author;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!event.OptOutType) {
                    return [2 /*return*/];
                }
                author = event.From;
                if (author.startsWith('whatsapp:')) {
                    author = author.slice(9);
                }
                return [4 /*yield*/, doOptInOrOut(context, event, author, true)];
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
                    if (!event.OptOutType) return [3 /*break*/, 4];
                    if (!(event.OptOutType === 'STOP')) return [3 /*break*/, 2];
                    return [4 /*yield*/, checkOptOut(context, event)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!(event.OptOutType === 'START')) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkOptIn(context, event)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    callback(null, {});
                    return [2 /*return*/];
            }
        });
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJzYXRpb24vd2ViaG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBOEQ7QUFLOUQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBZ0J2RSxJQUFNLFlBQVksR0FBRyxVQUFPLE9BQTJCLEVBQUUsS0FBZSxFQUFFLE1BQWMsRUFBRSxLQUFjOzs7OztnQkFFOUYsYUFBYSxHQUFHLElBQUksbUJBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtnQkFDL0UscUJBQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzt3QkFDaEQsS0FBSyxFQUFFLE1BQU07d0JBQ2IsWUFBWSxFQUFFLEVBQUU7d0JBQ2hCLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQzt3QkFDaEIsVUFBVSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQzt3QkFDekQsS0FBSyxFQUFFLENBQUM7d0JBQ1IsS0FBSyxFQUFFLENBQUM7cUJBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFPLFFBQTRCOzs7O3lDQUNuQyxDQUFBLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBLEVBQWxCLHdCQUFrQjtvQ0FDbEIscUJBQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzs0Q0FDN0MsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTztnREFDakMsT0FBTztvREFDSCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7b0RB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