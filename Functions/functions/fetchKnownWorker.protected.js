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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var axios_1 = __importDefault(require("axios"));
axios_1.default.defaults.baseURL = "https://api.hubapi.com";
axios_1.default.defaults.headers.common['Content-Type'] = 'application/json';
var fetchOwner = function (context, phone) { return __awaiter(void 0, void 0, void 0, function () {
    var result, hubspotResult, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(context.HUBSPOT_TOKEN);
                result = {
                    owner_id: null
                };
                if (phone === undefined || phone === '') {
                    return [2 /*return*/, result];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post("/crm/v3/objects/contacts/search", {
                        'query': phone,
                        'limit': 1
                    }).then(function (_a) {
                        var data = _a.data;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var contact;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(data.total === 0)) return [3 /*break*/, 1];
                                        return [2 /*return*/, null];
                                    case 1:
                                        contact = data.results[0];
                                        return [4 /*yield*/, axios_1.default.get("/crm/v3/objects/contacts/".concat(contact.properties.hs_object_id, "?properties=hubspot_owner_id"))
                                                .then(function (_a) {
                                                var data = _a.data;
                                                return __awaiter(void 0, void 0, void 0, function () {
                                                    var ownerId, client;
                                                    var _b;
                                                    return __generator(this, function (_c) {
                                                        switch (_c.label) {
                                                            case 0:
                                                                ownerId = (_b = data.properties) === null || _b === void 0 ? void 0 : _b.hubspot_owner_id;
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
                                                            case 1: return [2 /*return*/, _c.sent()];
                                                        }
                                                    });
                                                });
                                            })
                                                .catch(function (err) { return null; })];
                                    case 2: return [2 /*return*/, _b.sent()];
                                }
                            });
                        });
                    }).catch(function (err) { return null; })];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hLbm93bldvcmtlci5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmV0Y2hLbm93bldvcmtlci5wcm90ZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsZ0RBQTBCO0FBRTFCLGVBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLHdCQUF3QixDQUFDO0FBQ2xELGVBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxrQkFBa0IsQ0FBQTtBQVlsRSxJQUFNLFVBQVUsR0FBRyxVQUFPLE9BQXlCLEVBQUUsS0FBYTs7Ozs7Z0JBQzlELGVBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxpQkFBVSxPQUFPLENBQUMsYUFBYSxDQUFFLENBQUE7Z0JBRTVFLE1BQU0sR0FBbUI7b0JBQzNCLFFBQVEsRUFBRSxJQUFJO2lCQUNqQixDQUFBO2dCQUVELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLENBQUM7b0JBQ3RDLHNCQUFPLE1BQU0sRUFBQTtnQkFDakIsQ0FBQzs7OztnQkFHeUIscUJBQU0sZUFBSyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRTt3QkFDdEUsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsT0FBTyxFQUFFLENBQUM7cUJBQ2IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFPLEVBQThFOzRCQUE1RSxJQUFJLFVBQUE7Ozs7Ozs2Q0FDYixDQUFBLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFBLEVBQWhCLHdCQUFnQjt3Q0FDaEIsc0JBQU8sSUFBSSxFQUFBOzt3Q0FFTCxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTt3Q0FDeEIscUJBQU0sZUFBSyxDQUFD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