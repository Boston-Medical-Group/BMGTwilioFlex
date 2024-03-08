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
    var defaultSettings, countrySettings, optoutWords, body, author;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!event.Source || event.Source.toUpperCase() !== "WHATSAPP" || !event.Body || event.Body === '') {
                    return [2 /*return*/];
                }
                defaultSettings = optoput.optoutSettings.default;
                countrySettings = (_b = optoput.optoutSettings[(_a = context.COUNTRY) !== null && _a !== void 0 ? _a : '']) !== null && _b !== void 0 ? _b : {};
                optoutWords = defaultSettings.OPT_OUT_TEXT.concat((_c = countrySettings.OPT_OUT_TEXT) !== null && _c !== void 0 ? _c : []);
                body = event.Body.toLowerCase().trim();
                if (!optoutWords.includes(body)) {
                    return [2 /*return*/];
                }
                author = event.Author;
                if (author.startsWith('whatsapp:')) {
                    author = author.slice(9);
                }
                return [4 /*yield*/, doOptInOrOut(context, event, author, false).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, context.getTwilioClient().conversations.v1.conversations(event.ConversationSid).messages.create({
                                        author: 'System',
                                        body: (_a = countrySettings['OPT_OUT_MESSAGE']) !== null && _a !== void 0 ? _a : defaultSettings['OPT_OUT_MESSAGE'],
                                    })];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _d.sent();
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
    var defaultSettings, countrySettings, optoutWords, body, author;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!event.Source || event.Source.toUpperCase() !== "WHATSAPP" || !event.Body || event.Body === '') {
                    return [2 /*return*/];
                }
                defaultSettings = optoput.optoutSettings.default;
                countrySettings = (_b = optoput.optoutSettings[(_a = context.COUNTRY) !== null && _a !== void 0 ? _a : '']) !== null && _b !== void 0 ? _b : {};
                optoutWords = defaultSettings.OPT_IN_TEXT.concat((_c = countrySettings.OPT_IN_TEXT) !== null && _c !== void 0 ? _c : []);
                body = event.Body.toLowerCase().trim();
                if (!optoutWords.includes(body)) {
                    return [2 /*return*/];
                }
                author = event.Author;
                if (author.startsWith('whatsapp:')) {
                    author = author.slice(9);
                }
                return [4 /*yield*/, doOptInOrOut(context, event, author, true).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, context.getTwilioClient().conversations.v1.conversations(event.ConversationSid).messages.create({
                                        author: 'System',
                                        body: (_a = countrySettings['OPT_IN_MESSAGE']) !== null && _a !== void 0 ? _a : defaultSettings['OPT_IN_MESSAGE'],
                                    })];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _d.sent();
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
                    if (!(event.EventType === "onMessageAdded")) return [3 /*break*/, 3];
                    return [4 /*yield*/, checkOptOut(context, event)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, checkOptIn(context, event)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    callback(null);
                    return [2 /*return*/];
            }
        });
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJzYXRpb24vd2ViaG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBOEQ7QUFLOUQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBbUJ2RSxJQUFNLFlBQVksR0FBRyxVQUFPLE9BQTJCLEVBQUUsS0FBZSxFQUFFLE1BQWMsRUFBRSxLQUFjOzs7OztnQkFFOUYsYUFBYSxHQUFHLElBQUksbUJBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtnQkFDL0UscUJBQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzt3QkFDaEQsS0FBSyxFQUFFLE1BQU07d0JBQ2IsWUFBWSxFQUFFLEVBQUU7d0JBQ2hCLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQzt3QkFDaEIsVUFBVSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQzt3QkFDekQsS0FBSyxFQUFFLENBQUM7d0JBQ1IsS0FBSyxFQUFFLENBQUM7cUJBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFPLFFBQTRCOzs7O3lDQUNuQyxDQUFBLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBLEVBQWxCLHdCQUFrQjtvQ0FDbEIscUJBQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzs0Q0FDN0MsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTztnREFDakMsT0FBTztvREFDSCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7b0RB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