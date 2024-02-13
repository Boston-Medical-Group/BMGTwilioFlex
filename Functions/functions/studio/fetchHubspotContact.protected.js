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
    return __awaiter(this, void 0, void 0, function () {
        var result, from, fromWithoutPrefix, hubspotClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = {
                        crmid: '',
                        firstname: '',
                        lastname: '',
                        fullname: '',
                        lifecyclestage: 'lead',
                        leadorpatient: 'lead'
                    };
                    from = event.from;
                    //if the string from contains a whatsapp prefix we need to remove it
                    from = from.replace('whatsapp:', '');
                    from = from.replace(' ', '+');
                    fromWithoutPrefix = removePrefix(from, ['+593', '+52', '+34', '+1', '+51', '+54', '+56', '+57']);
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    return [4 /*yield*/, hubspotClient.crm.contacts.searchApi.doSearch({
                            //query: from,
                            filterGroups: [
                                {
                                    filters: [
                                        {
                                            propertyName: 'phone',
                                            operator: 'EQ',
                                            value: from
                                        }
                                    ]
                                }, {
                                    filters: [
                                        {
                                            propertyName: 'phone',
                                            operator: 'CONTAINS_TOKEN',
                                            value: "*".concat(fromWithoutPrefix)
                                        }
                                    ]
                                }
                            ],
                            //@ts-ignore
                            sorts: [{
                                    propertyName: 'phone',
                                    direction: 'ASCENDING'
                                }],
                            properties: ['firstname', 'lastname', 'lifecyclestage', 'phone'],
                            limit: 1,
                            after: 0
                        }).then(function (contacts) {
                            var _a, _b, _c, _d;
                            if (contacts.total > 0) {
                                var contact = contacts.results[0];
                                //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
                                result.crmid = "".concat(contact.id); //required for screenpop
                                result.firstname = "".concat(contact.properties.firstname);
                                result.lastname = "".concat(contact.properties.lastname);
                                result.fullname = "".concat((_a = contact.properties.firstname) !== null && _a !== void 0 ? _a : '', " ").concat((_b = contact.properties.lastname) !== null && _b !== void 0 ? _b : '');
                                result.lifecyclestage = "".concat((_d = (_c = contact.properties) === null || _c === void 0 ? void 0 : _c.lifecyclestage) !== null && _d !== void 0 ? _d : 'lead');
                                if ((result.lifecyclestage != 'lead') && (result.lifecyclestage != 'marketingqualifiedlead') && (result.lifecyclestage != 'opportunity' && (result.lifecyclestage !== 'subscriber'))) {
                                    result.leadorpatient = 'patient';
                                }
                                if (result.fullname.trim() == '') {
                                    result.fullname = 'Customer';
                                }
                                callback(null, result);
                            }
                            else {
                                callback(null, {});
                            }
                        }).catch(function (error) {
                            // handle error
                            console.log("Error: ".concat(error));
                            callback(null, error);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var removePrefix = function (phone, prefixes) {
    for (var _i = 0, prefixes_1 = prefixes; _i < prefixes_1.length; _i++) {
        var prefix = prefixes_1[_i];
        if (phone.startsWith(prefix)) {
            phone = phone.slice(prefix.length);
            break;
        }
    }
    return phone;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hIdWJzcG90Q29udGFjdC5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3R1ZGlvL2ZldGNoSHVic3BvdENvbnRhY3QucHJvdGVjdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQThEO0FBYTlELE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFDZCxPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7OztvQkFHeEIsTUFBTSxHQUFHO3dCQUNULEtBQUssRUFBRSxFQUFFO3dCQUNULFNBQVMsRUFBRSxFQUFFO3dCQUNiLFFBQVEsRUFBRSxFQUFFO3dCQUNaLFFBQVEsRUFBRSxFQUFFO3dCQUNaLGNBQWMsRUFBRSxNQUFNO3dCQUN0QixhQUFhLEVBQUUsTUFBTTtxQkFDeEIsQ0FBQztvQkFDRSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFFdEIsb0VBQW9FO29CQUNwRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3JDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUIsaUJBQWlCLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO29CQUU5RixhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFBO29CQUMvRSxxQkFBTSxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDOzRCQUNoRCxjQUFjOzRCQUNkLFlBQVks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