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
    var result, hubspotClient_1, hubspotResult, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = {
                    owner_id: null
                };
                if (phone === undefined || phone === '') {
                    return [2 /*return*/, result];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                hubspotClient_1 = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                return [4 /*yield*/, hubspotClient_1.crm.contacts.searchApi.doSearch({
                        'query': phone,
                        'filterGroups': [],
                        'sorts': ['phone'],
                        //'query'?: string;
                        'properties': ['firstname', 'lastname', 'owner_id'],
                        'limit': 1,
                        'after': 0
                    }).then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
                        var contact;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(response.total === 0)) return [3 /*break*/, 1];
                                    return [2 /*return*/, null];
                                case 1:
                                    contact = response.results[0];
                                    return [4 /*yield*/, hubspotClient_1.crm.contacts.basicApi.getById(contact.properties.hs_object_id, ['hubspot_owner_id'])
                                            .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
                                            var ownerId, client;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        ownerId = (_a = response.properties) === null || _a === void 0 ? void 0 : _a.hubspot_owner_id;
                                                        client = context.getTwilioClient();
                                                        return [4 /*yield*/, client.taskrouter.v1
                                                                .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                                                                .workers
                                                                .list({
                                                                targetWorkersExpression: "hubspot_owner_id=".concat(ownerId)
                                                            }).then(function (workersList) {
                                                                var _a;
                                                                if (workersList.length === 0) {
                                                                    return null;
                                                                }
                                                                else {
                                                                    return (_a = workersList[0]) === null || _a === void 0 ? void 0 : _a.sid;
                                                                }
                                                            }).catch(function (err) { return null; })];
                                                    case 1: return [2 /*return*/, _b.sent()];
                                                }
                                            });
                                        }); })
                                            .catch(function (err) { return null; })];
                                case 2: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }).catch(function (err) { return null; })];
            case 2:
                hubspotResult = _a.sent();
                result.owner_id = hubspotResult;
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, result];
        }
    });
}); };
var handler = function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var phone, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    phone = event.from.trim();
                    if (!phone.startsWith('+')) {
                        phone = "+".concat(phone);
                    }
                    return [4 /*yield*/, fetchOwner(context, event.from)];
                case 1:
                    result = _a.sent();
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody(result);
                    // Return a success response using the callback function.
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hLbm93bldvcmtlci5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmV0Y2hLbm93bldvcmtlci5wcm90ZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsa0RBQTZEO0FBYTdELElBQU0sVUFBVSxHQUFHLFVBQU8sT0FBeUIsRUFBRSxLQUFhOzs7OztnQkFDeEQsTUFBTSxHQUFtQjtvQkFDM0IsUUFBUSxFQUFFLElBQUk7aUJBQ2pCLENBQUE7Z0JBRUQsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7b0JBQ3JDLHNCQUFPLE1BQU0sRUFBQTtpQkFDaEI7Ozs7Z0JBR1Msa0JBQWdCLElBQUksbUJBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtnQkFDekQscUJBQU0sZUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzt3QkFDdEUsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsY0FBYyxFQUFFLEVBQUU7d0JBQ2xCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQzt3QkFDbEIsbUJBQW1CO3dCQUNuQixZQUFZLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQzt3QkFDbkQsT0FBTyxFQUFFLENBQUM7d0JBQ1YsT0FBTyxFQUFFLENBQUM7cUJBQ2IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFPLFFBQW9FOzs7Ozt5Q0FDM0UsQ0FBQSxRQUFRLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQSxFQUFwQix3QkFBb0I7b0NBQ3BCLHNCQUFPLElBQUksRUFBQTs7b0NBRUwsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7b0NBQzVCLHFCQUFNLGVBQWEsQ0FBQyxHQUFHLENBQUMs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