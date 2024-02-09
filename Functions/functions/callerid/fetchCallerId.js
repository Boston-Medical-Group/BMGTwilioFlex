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
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
var node_fetch_1 = __importDefault(require("node-fetch"));
var utils = require(Runtime.getFunctions()['helpers/utils'].path);
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var PAGE_SIZE, Token, callerId, count, queueSid, country, countryResponse, defaultQueue, prefix, useAreaDDI, queryQueue, callerIdsResponse, toNumberWOPrefix, i, probableAreaCode, err_1, response, err_2, response;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    PAGE_SIZE = 150;
                    Token = event.Token;
                    count = 0;
                    queueSid = (_a = event.queueSid) !== null && _a !== void 0 ? _a : undefined;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 14, , 15]);
                    country = utils.countryToIso2(context.COUNTRY);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 12, , 13]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(context.FLEXMANAGER_API_URL, "/countries/").concat(context.COUNTRY), {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/vnd.api+json',
                                'Authorization': "Bearer ".concat(context.FLEXMANAGER_API_KEY)
                            }
                        })
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, res.json()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 3:
                    countryResponse = _c.sent();
                    defaultQueue = countryResponse.data.attributes.defaultQueue;
                    prefix = countryResponse.data.attributes.prefix;
                    useAreaDDI = countryResponse.data.attributes.useAreaCode;
                    queryQueue = event.queueSid || defaultQueue;
                    callerIdsResponse = null;
                    if (!(useAreaDDI && event.toNumber)) return [3 /*break*/, 8];
                    toNumberWOPrefix = event.toNumber.replace(prefix, '');
                    i = 3;
                    _c.label = 4;
                case 4:
                    if (!(i > 1)) return [3 /*break*/, 8];
                    probableAreaCode = toNumberWOPrefix.substring(0, i);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(context.FLEXMANAGER_API_URL, "/caller-id-pools?filter[country]=").concat(context.COUNTRY, "&filter[queue]=").concat(probableAreaCode, "&page[size]=").concat(PAGE_SIZE), {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/vnd.api+json',
                                'Authorization': "Bearer ".concat(context.FLEXMANAGER_API_KEY)
                            }
                        })
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, res.json()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 5:
                    callerIdsResponse = _c.sent();
                    if (!(callerIdsResponse !== null && callerIdsResponse.meta.page.total)) return [3 /*break*/, 7];
                    return [4 /*yield*/, utils.getRRCounter(probableAreaCode, context)];
                case 6:
                    count = (_c.sent()) || 0;
                    return [3 /*break*/, 8];
                case 7:
                    i--;
                    return [3 /*break*/, 4];
                case 8:
                    if (!(callerIdsResponse === null || !callerIdsResponse.meta.page.total)) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(context.FLEXMANAGER_API_URL, "/caller-id-pools?filter[country]=").concat(context.COUNTRY, "&filter[queue]=").concat(queryQueue, "&page[size]=").concat(PAGE_SIZE), {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/vnd.api+json',
                                'Authorization': "Bearer ".concat(context.FLEXMANAGER_API_KEY)
                            }
                        })
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, res.json()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 9:
                    callerIdsResponse = _c.sent();
                    return [4 /*yield*/, utils.getRRCounter(queryQueue, context)];
                case 10:
                    count = (_c.sent()) || 0;
                    _c.label = 11;
                case 11:
                    if (count >= callerIdsResponse.meta.page.total) {
                        count = 0;
                    }
                    callerId = ((_b = callerIdsResponse.data.at(count)) === null || _b === void 0 ? void 0 : _b.attributes.ddi) || null;
                    //console.log(`CALLERID COUNTER: ${count}, TOTAL: ${callerIdsResponse.data.length}, FROM: ${context.FLEXMANAGER_API_URL}/caller-id-pools?filter[country]=${context.COUNTRY}&filter[queue]=${queryQueue}&page[size]=${PAGE_SIZE}`)
                    count++;
                    utils.updateRRCounter(queueSid, count, context);
                    if (callerId === null) {
                        console.log("CALLERID NULL FOR: ".concat(queueSid));
                    }
                    return [3 /*break*/, 13];
                case 12:
                    err_1 = _c.sent();
                    console.log(err_1);
                    callerId = null;
                    return [3 /*break*/, 13];
                case 13:
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody({ callerId: callerId });
                    // Return a success response using the callback function.
                    callback(null, response);
                    return [3 /*break*/, 15];
                case 14:
                    err_2 = _c.sent();
                    if (err_2 instanceof Error) {
                        response = new Twilio.Response();
                        response.appendHeader("Access-Control-Allow-Origin", "*");
                        response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                        response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                        response.appendHeader("Content-Type", "plain/text");
                        response.setBody(err_2.message);
                        response.setStatusCode(500);
                        // If there's an error, send an error response
                        // Keep using the response object for CORS purposes
                        console.error(err_2);
                        callback(null, response);
                    }
                    else {
                        callback(null, {});
                    }
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hDYWxsZXJJZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWxsZXJpZC9mZXRjaENhbGxlcklkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkVBQXlGO0FBQ3pGLDBEQUE4QjtBQUU5QixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBa0VwRSxZQUFZO0FBQ1osT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFBLCtDQUFzQixFQUFDLFVBQ3ZDLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0Qjs7Ozs7Ozs7b0JBRXRCLFNBQVMsR0FBRyxHQUFHLENBQUE7b0JBRW5CLEtBQUssR0FDSCxLQUFLLE1BREYsQ0FDRztvQkFFSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixRQUFRLEdBQUcsTUFBQSxLQUFLLENBQUMsUUFBUSxtQ0FBSSxTQUFTLENBQUM7Ozs7b0JBRW5DLE9BQU8sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7OztvQkFJVixxQkFBTSxJQUFBLG9CQUFLLEVBQUMsVUFBRyxPQUFPLENBQUMsbUJBQW1CLHdCQUFjLE9BQU8sQ0FBQyxPQUFPLENBQUUsRUFBRTs0QkFDbEgsTUFBTSxFQUFFLEtBQUs7NEJBQ2IsT0FBTyxFQUFFO2dDQUNQLGNBQWMsRUFBRSwwQkFBMEI7Z0NBQzFDLGVBQWUsRUFBRSxpQkFBVSxPQUFPLENBQUMsbUJBQW1CLENBQUU7NkJBQ3pEO3lCQUNGLENBQUM7NkJBQ0MsSUFBSSxDQUFDLFVBQU8sR0FBRzs7OzRDQUNQLHFCQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQTs0Q0FBdkIsc0JBQU8sU0FBZ0IsRUFBQTs7OzZCQUN4QixDQUFDLEVBQUE7O29CQVRF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