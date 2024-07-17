"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
require("@twilio-labs/serverless-runtime-types");
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var response, sendResponse_1, conversationContext_1, err_1;
        var _this = this;
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
                    sendResponse_1 = {};
                    conversationContext_1 = context.getTwilioClient().conversations.v1.conversations(event.conversationSid);
                    return [4 /*yield*/, conversationContext_1.fetch().then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var participants;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, conversationContext_1.participants.list()];
                                    case 1:
                                        participants = _a.sent();
                                        sendResponse_1 = __assign(__assign({}, data.toJSON()), { participants: participants });
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    response.setBody(sendResponse_1);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    response.setStatusCode(500);
                    if (err_1 instanceof Error) {
                        response.setBody({ error: err_1.message });
                    }
                    else {
                        response.setBody({ error: err_1 });
                    }
                    return [3 /*break*/, 4];
                case 4:
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q29udmVyc2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2dldENvbnZlcnNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQStDO0FBRS9DLDJFQUFnSTtBQXNCaEksWUFBWTtBQUNaLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBQSwrQ0FBc0IsRUFBQyxVQUNyQyxPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBa0I7Ozs7Ozs7b0JBR1osUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMxRCxRQUFRLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQzFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBQ3RFLFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Ozs7b0JBR2xELGlCQUFxQixFQUFFLENBQUM7b0JBRXRCLHdCQUFzQixPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO29CQUMzRyxxQkFBTSxxQkFBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBTyxJQUFJOzs7OzRDQUMzQixxQkFBTSxxQkFBbUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUE7O3dDQUE1RCxZQUFZLEdBQUcsU0FBNkM7d0NBQ2hFLGNBQVkseUJBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUNoQixZQUFZLGNBQUEsR0FDZixDQUFBOzs7OzZCQUNKLENBQUMsRUFBQTs7b0JBTkYsU0FNRSxDQUFBO29CQUVGLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBWSxDQUFDLENBQUM7Ozs7b0JBRy9CLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVCLElBQUksS0FBRyxZQUFZLEtBQUssRUFBRTt3QkFDdEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztxQkFDNUM7eUJBQU07d0JBQ0gsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFHLEVBQUMsQ0FBQyxDQUFDO3FCQUNuQzs7O29CQUdMLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Ozs7O0NBQzVCLENBQUMsQ0FBQyJ9