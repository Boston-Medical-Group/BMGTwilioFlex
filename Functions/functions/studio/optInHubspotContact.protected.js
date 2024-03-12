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
var api_client_1 = require("@hubspot/api-client");
exports.handler = function (context, event, callback) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var contact_id, channel, silent, hubspotClient;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    contact_id = event.contact_id;
                    channel = (_a = event.channel) !== null && _a !== void 0 ? _a : false;
                    silent = (_b = event.silent) !== null && _b !== void 0 ? _b : true;
                    if (!channel) {
                        callback(null, {});
                    }
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    return [4 /*yield*/, hubspotClient.crm.contacts.basicApi.update(contact_id, {
                            properties: {
                                'whatsappoptout': 'false'
                            }
                        }).then(function (contact) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (!silent) {
                                    // Todo: agregar notificación
                                }
                                callback(null, {});
                                return [2 /*return*/];
                            });
                        }); }).catch(function (err) {
                            console.log(err);
                            callback(null, { error: err });
                        })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0SW5IdWJzcG90Q29udGFjdC5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3R1ZGlvL29wdEluSHVic3BvdENvbnRhY3QucHJvdGVjdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQThEO0FBZTlELE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFDZCxPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7Ozs7O29CQUd0QixVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQTtvQkFDN0IsT0FBTyxHQUFHLE1BQUEsS0FBSyxDQUFDLE9BQU8sbUNBQUksS0FBSyxDQUFBO29CQUNoQyxNQUFNLEdBQUcsTUFBQSxLQUFLLENBQUMsTUFBTSxtQ0FBSSxJQUFJLENBQUE7b0JBRW5DLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ1YsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDdEI7b0JBR0ssYUFBYSxHQUFHLElBQUksbUJBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtvQkFDL0UscUJBQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7NEJBQ3pELFVBQVUsRUFBRTtnQ0FDUixnQkFBZ0IsRUFBRSxPQUFPOzZCQUM1Qjt5QkFDSixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQU8sT0FBMkI7O2dDQUN0QyxJQUFJLENBQUMsTUFBTSxFQUFFO29DQUNULDhCQUE4QjtpQ0FDakM7Z0NBRUQsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQzs7OzZCQUN0QixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzs0QkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBOzRCQUNoQixRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7d0JBQ2pDLENBQUMsQ0FBQyxFQUFBOztvQkFiRixTQWFFLENBQUE7Ozs7O0NBQ0wsQ0FBQyJ9