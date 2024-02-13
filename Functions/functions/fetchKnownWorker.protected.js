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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hLbm93bldvcmtlci5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmV0Y2hLbm93bldvcmtlci5wcm90ZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQTZEO0FBYzdELElBQU0sVUFBVSxHQUFHLFVBQU8sT0FBeUIsRUFBRSxLQUFhOzs7OztnQkFDeEQsTUFBTSxHQUFtQjtvQkFDM0IsUUFBUSxFQUFFLElBQUk7aUJBQ2pCLENBQUE7Z0JBRUQsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsQ0FBQztvQkFDdEMsc0JBQU8sTUFBTSxFQUFBO2dCQUNqQixDQUFDOzs7O2dCQUdTLGtCQUFnQixJQUFJLG1CQUFhLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7Z0JBQ3pELHFCQUFNLGVBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7d0JBQ3RFLEtBQUssRUFBRSxLQUFLO3dCQUNaLFlBQVksRUFBRSxFQUFFO3dCQUNoQixLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUM7d0JBQ2hCLFVBQVUsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLENBQUM7d0JBQ3pELEtBQUssRUFBRSxDQUFDO3dCQUNSLEtBQUssRUFBRSxDQUFDO3FCQUNYLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBTyxRQUE0Qjs7Ozt5Q0FDbkMsQ0FBQSxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQSxFQUFsQix3QkFBa0I7b0NBRVgscUJBQU0sZUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzs0Q0FDcEQsWUFBWSxFQUFFLENBQUM7b0RBQ1gsT0FBTyxFQUFFO3dEQUNMOzREQUNJ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