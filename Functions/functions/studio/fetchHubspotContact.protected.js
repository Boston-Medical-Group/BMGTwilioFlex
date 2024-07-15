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
        var result, from, fromWithoutPrefix, additionalFilters, tmpPhone, prefix, validPrefixes, tmpPhoneWithoutPrefix, hubspotClient;
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
                    if (event.from === undefined) {
                        return [2 /*return*/, callback({ error: 'from is required' })];
                    }
                    //if the string from contains a whatsapp prefix we need to remove it
                    from = from.replace('whatsapp:', '');
                    from = from.replace(' ', '+');
                    fromWithoutPrefix = removePrefix(from, ['+593', '+52', '+521', '+34', '+1', '+51', '+54', '+56', '+57', '+55']);
                    additionalFilters = [
                        {
                            propertyName: 'phone',
                            operator: 'CONTAINS_TOKEN',
                            value: "*".concat(fromWithoutPrefix)
                        }
                    ];
                    // Fix para brasil
                    if (from.startsWith('+55')) {
                        tmpPhone = from.replace('+55', '');
                        prefix = tmpPhone.slice(0, 2);
                        validPrefixes = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34',
                            '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65',
                            '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92',
                            '93', '94', '95', '96', '97', '98', '99'];
                        if (validPrefixes.includes(prefix)) {
                            tmpPhoneWithoutPrefix = tmpPhone.slice(2);
                            if (tmpPhoneWithoutPrefix.length === 8) {
                                from = "+55".concat(prefix, "9").concat(tmpPhoneWithoutPrefix);
                                additionalFilters.push({
                                    propertyName: 'phone',
                                    operator: 'CONTAINS_TOKEN',
                                    value: "*".concat(prefix, "9").concat(tmpPhoneWithoutPrefix)
                                });
                            }
                            else {
                                additionalFilters.push({
                                    propertyName: 'phone',
                                    operator: 'CONTAINS_TOKEN',
                                    value: "*".concat(prefix).concat(tmpPhoneWithoutPrefix.slice(1))
                                });
                            }
                        }
                    }
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
                                    filters: additionalFilters
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hIdWJzcG90Q29udGFjdC5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3R1ZGlvL2ZldGNoSHVic3BvdENvbnRhY3QucHJvdGVjdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQThEO0FBYTlELE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFDZCxPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7OztvQkFHeEIsTUFBTSxHQUFHO3dCQUNULEtBQUssRUFBRSxFQUFFO3dCQUNULFNBQVMsRUFBRSxFQUFFO3dCQUNiLFFBQVEsRUFBRSxFQUFFO3dCQUNaLFFBQVEsRUFBRSxFQUFFO3dCQUNaLGNBQWMsRUFBRSxNQUFNO3dCQUN0QixhQUFhLEVBQUUsTUFBTTtxQkFDeEIsQ0FBQztvQkFDRSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFFdEIsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTt3QkFDMUIsc0JBQU8sUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLENBQUMsRUFBQztxQkFDbEQ7b0JBRUQsb0VBQW9FO29CQUNwRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3JDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUIsaUJBQWlCLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7b0JBRS9HLGlCQUFpQixHQUFTO3dCQUMxQjs0QkFDSSxZQUFZ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