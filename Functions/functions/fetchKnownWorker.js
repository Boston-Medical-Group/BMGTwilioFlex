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
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchOwner(context, event.from)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hLbm93bldvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mZXRjaEtub3duV29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLGtEQUE2RDtBQWE3RCxJQUFNLFVBQVUsR0FBRyxVQUFPLE9BQXlCLEVBQUUsS0FBYTs7Ozs7Z0JBQ3hELE1BQU0sR0FBbUI7b0JBQzNCLFFBQVEsRUFBRSxJQUFJO2lCQUNqQixDQUFBOzs7O2dCQUdTLGtCQUFnQixJQUFJLG1CQUFhLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7Z0JBQ3pELHFCQUFNLGVBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7d0JBQ3RFLE9BQU8sRUFBRSxLQUFLO3dCQUNkLGNBQWMsRUFBRSxFQUFFO3dCQUNsQixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7d0JBQ2xCLG1CQUFtQjt3QkFDbkIsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUM7d0JBQ25ELE9BQU8sRUFBRSxDQUFDO3dCQUNWLE9BQU8sRUFBRSxDQUFDO3FCQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBTyxRQUFvRTs7Ozs7eUNBQzNFLENBQUEsUUFBUSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUEsRUFBcEIsd0JBQW9CO29DQUNwQixzQkFBTyxJQUFJLEVBQUE7O29DQUVMLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO29DQUM1QixxQkFBTSxlQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBc0IsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUM7NkNBQ3BILElBQUksQ0FBQyxVQUFNLFFBQVE7Ozs7Ozt3REFDVixPQUFPLEdBQUcsTUFBQSxRQUFRLENBQUMsVUFBVSwwQ0FBRSxnQkFBZ0IsQ0FBQTt3REFDL0MsTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQzt3REFDbEMscUJBQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2lFQUM1QixVQUFVLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDO2lFQUM3QyxPQUFPO2lFQUNQLElBQUksQ0FBQztnRUFDRix1QkFBdUIsRUFBRSwyQkFBb0IsT0FBTyxDQUFFOzZEQUN6RCxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVzs7Z0VBQ2hCLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0VBQzFCLE9BQU8sSUFBSSxDQUFBO2lFQUNkO3FFQUFNO29FQUNILE9BQU8sTUFBQSxXQUFXLENBQUMsQ0FBQyxDQUFDLDBDQUFFLEdBQUcsQ0FBQTtpRUFDN0I7NERBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxFQUFBOzREQVh6QixzQkFBTyxTQVdrQixFQUFBOzs7NkNBRTVCLENBQUM7NkNBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxFQUFBO3dDQWxCdkIsc0JBQU8sU0FrQmdCLEVBQUE7Ozt5QkFFOUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsRUFBQTs7Z0JBakNmLGFBQWEsR0FBRyxTQWlDRDtnQkFFckIsTUFBTSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUE7Ozs7Z0JBRS9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBSyxDQUFDLENBQUE7O29CQUd0QixzQkFBTyxNQUFNLEVBQUE7OztLQUNoQixDQUFBO0FBS00sSUFBTSxPQUFPLEdBQUksVUFDcEIsT0FBeUIsRUFDekIsS0FBcUMsRUFDckMsUUFBNEI7Ozs7O3dCQUdiLHFCQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFBOztvQkFBOUMsTUFBTSxHQUFHLFNBQXFDO29CQUU5QyxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3ZDLFFBQVEsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzFELFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDMUUsUUFBUSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxjQUFjLENBQUMsQ0FBQztvQkFFdEUsUUFBUSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztvQkFDMUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFekIseURBQXlEO29CQUN6RCxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7OztDQUU1QixDQUFBO0FBbkJZLFFBQUEsT0FBTyxXQW1CbkIifQ==