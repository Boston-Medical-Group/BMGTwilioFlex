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
var fetchOwner = function (context, phone) { return __awaiter(void 0, void 0, void 0, function () {
    var result, hubspotClient_1, hubspotResult, client, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                result = {
                    owner_id: null
                };
                if (phone === undefined || phone === '') {
                    return [2 /*return*/, result];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                hubspotClient_1 = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                return [4 /*yield*/, hubspotClient_1.crm.contacts.searchApi.doSearch({
                        query: phone,
                        filterGroups: [],
                        sorts: ['phone'],
                        properties: ['firstname', 'lastname', 'hubspot_owner_id'],
                        limit: 1,
                        after: 0
                    }).then(function (contacts) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(contacts.total > 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, hubspotClient_1.crm.deals.searchApi.doSearch({
                                            filterGroups: [{
                                                    filters: [
                                                        {
                                                            propertyName: "associations.contact",
                                                            operator: "EQ",
                                                            value: "".concat(contacts.results[0].properties.hs_object_id)
                                                        }
                                                    ]
                                                }],
                                            sorts: ["hs_lastmodifieddate"],
                                            limit: 1,
                                            properties: ["hubspot_owner_id"],
                                            after: 0
                                        })
                                            .then(function (deals) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, deals.total > 0
                                                        ? deals.results[0].properties.hubspot_owner_id
                                                        : (contacts.total > 0
                                                            ? contacts.results[0].properties.hubspot_owner_id
                                                            : null)];
                                            });
                                        }); })
                                            .catch(function (err) {
                                            return null;
                                        })];
                                case 1: 
                                // Obtiene el negocio más reciente del contacto
                                return [2 /*return*/, _a.sent()];
                                case 2: return [2 /*return*/, null];
                            }
                        });
                    }); }).catch(function (err) {
                        console.log(err);
                        return null;
                    })];
            case 2:
                hubspotResult = _b.sent();
                if (!(hubspotResult !== null)) return [3 /*break*/, 4];
                client = context.getTwilioClient();
                _a = result;
                return [4 /*yield*/, client.taskrouter.v1
                        .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                        .workers
                        .list({
                        targetWorkersExpression: "hubspot_owner_id=".concat(hubspotResult)
                    })
                        .then(function (workersList) { var _a; return workersList.length === 0 ? null : (_a = workersList[0]) === null || _a === void 0 ? void 0 : _a.sid; })
                        .catch(function (err) { return null; })];
            case 3:
                _a.owner_id = _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.log(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, result];
        }
    });
}); };
var handler = function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, phone, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    phone = event.from.trim();
                    if (phone.startsWith('whatsapp:')) {
                        phone = phone.slice(9);
                    }
                    if (!phone.startsWith('+')) {
                        phone = "+".concat(phone);
                    }
                    return [4 /*yield*/, fetchOwner(context, event.from)];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    result = { status: 'err' };
                    response.setStatusCode(500);
                    return [3 /*break*/, 4];
                case 4:
                    response.setBody(result);
                    // Return a success response using the callback function.
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hLbm93bldvcmtlci5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmV0Y2hLbm93bldvcmtlci5wcm90ZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQTZEO0FBYzdELElBQU0sVUFBVSxHQUFHLFVBQU8sT0FBeUIsRUFBRSxLQUFhOzs7OztnQkFDeEQsTUFBTSxHQUFtQjtvQkFDM0IsUUFBUSxFQUFFLElBQUk7aUJBQ2pCLENBQUE7Z0JBRUQsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7b0JBQ3JDLHNCQUFPLE1BQU0sRUFBQTtpQkFDaEI7Ozs7Z0JBR1Msa0JBQWdCLElBQUksbUJBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtnQkFDekQscUJBQU0sZUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzt3QkFDdEUsS0FBSyxFQUFFLEtBQUs7d0JBQ1osWUFBWSxFQUFFLEVBQUU7d0JBQ2hCLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQzt3QkFDaEIsVUFBVSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQzt3QkFDekQsS0FBSyxFQUFFLENBQUM7d0JBQ1IsS0FBSyxFQUFFLENBQUM7cUJBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFPLFFBQTRCOzs7O3lDQUNuQyxDQUFBLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBLEVBQWxCLHdCQUFrQjtvQ0FFWCxxQkFBTSxlQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDOzRDQUNwRCxZQUFZLEVBQUUsQ0FBQztvREFDWCxPQUFPLEVBQUU7d0RBQ0w7NERBQ0ksWUFBWSxFQUFF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