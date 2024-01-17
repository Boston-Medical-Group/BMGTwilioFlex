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
var node_fetch_1 = __importDefault(require("node-fetch"));
var utils = require(Runtime.getFunctions()['helpers/utils'].path);
//@ts-ignore
/*
exports.handler = FunctionTokenValidator(async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {*/
exports.handler = function (context, event, callback) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var Token, callerId, count, queueSid, country, countryResponse, defaultQueue, queryQueue, callerIdsResponse, err_1, response, err_2, response;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    Token = event.Token;
                    count = 0;
                    queueSid = (_a = event.queueSid) !== null && _a !== void 0 ? _a : undefined;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 8, , 9]);
                    country = utils.countryToIso2(context.COUNTRY);
                    context.COUNTRY = 'esp';
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 6, , 7]);
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
                                    case 0:
                                        console.log(res);
                                        return [4 /*yield*/, res.json()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 3:
                    countryResponse = _c.sent();
                    defaultQueue = countryResponse.data.attributes.defaultQueue;
                    queryQueue = event.queueSid || defaultQueue;
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(context.FLEXMANAGER_API_URL, "/caller-id-pools?filter[country]=").concat(context.COUNTRY, "&filter[queue]=").concat(queryQueue), {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/vnd.api+json',
                                'Authorization': "Bearer ".concat(context.FLEXMANAGER_API_KEY)
                            }
                        })
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, res.json()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 4:
                    callerIdsResponse = _c.sent();
                    return [4 /*yield*/, utils.getRRCounter(queryQueue, context)];
                case 5:
                    count = (_c.sent()) || 0;
                    if (count >= callerIdsResponse.meta.page.total) {
                        count = 0;
                    }
                    callerId = ((_b = callerIdsResponse.data.at(count)) === null || _b === void 0 ? void 0 : _b.attributes.ddi) || null;
                    count++;
                    utils.updateRRCounter(queueSid, count, context);
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _c.sent();
                    callerId = null;
                    return [3 /*break*/, 7];
                case 7:
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody({ callerId: callerId });
                    // Return a success response using the callback function.
                    callback(null, response);
                    return [3 /*break*/, 9];
                case 8:
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
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hDYWxsZXJJZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jYWxsZXJpZC9mZXRjaENhbGxlcklkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMERBQThCO0FBRTlCLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFpRXBFLFlBQVk7QUFDWjs7Ozs7S0FLSztBQUNILE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFBZ0IsT0FBMkIsRUFDM0QsS0FBYyxFQUNkLFFBQTRCOzs7Ozs7OztvQkFFNUIsS0FBSyxHQUNILEtBQUssTUFERixDQUNHO29CQUVJLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQ3BCLFFBQVEsR0FBRyxNQUFBLEtBQUssQ0FBQyxRQUFRLG1DQUFJLFNBQVMsQ0FBQzs7OztvQkFFbkMsT0FBTyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUVyRCxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7OztvQkFFbUIscUJBQU0sSUFBQSxvQkFBSyxFQUFDLFVBQUcsT0FBTyxDQUFDLG1CQUFtQix3QkFBYyxPQUFPLENBQUMsT0FBTyxDQUFFLEVBQUU7NEJBQ2xILE1BQU0sRUFBRSxLQUFLOzRCQUNiLE9BQU8sRUFBRTtnQ0FDUCxjQUFjLEVBQUUsMEJBQTBCO2dDQUMxQyxlQUFlLEVBQUUsaUJBQVUsT0FBTyxDQUFDLG1CQUFtQixDQUFFOzZCQUN6RDt5QkFDRixDQUFDOzZCQUNDLElBQUksQ0FBQyxVQUFPLEdBQUc7Ozs7d0NBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTt3Q0FDVCxxQkFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUE7NENBQXZCLHNCQUFP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