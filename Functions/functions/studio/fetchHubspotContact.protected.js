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
        var result, from, fromWithoutPrefix, filterGroups, tmpPhone, prefix, validPrefixes, tmpPhoneWithoutPrefix, hubspotClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = {
                        crmid: '',
                        firstname: '',
                        lastname: '',
                        fullname: '',
                        lifecyclestage: 'lead',
                        leadorpatient: 'lead',
                        tf_default_queue: '',
                        tf_default_workflow: ''
                    };
                    from = event.from;
                    if (event.from === undefined) {
                        return [2 /*return*/, callback({ error: 'from is required' })];
                    }
                    //if the string from contains a whatsapp prefix we need to remove it
                    from = from.replace('whatsapp:', '');
                    from = from.replace(' ', '+');
                    fromWithoutPrefix = removePrefix(from, ['+593', '+52', '+521', '+34', '+1', '+51', '+54', '+56', '+57', '+55']);
                    filterGroups = [
                        {
                            filters: [
                                {
                                    propertyName: 'phone',
                                    operator: 'EQ',
                                    value: from
                                }
                            ]
                        },
                        {
                            filters: [
                                {
                                    propertyName: 'phone',
                                    operator: 'CONTAINS_TOKEN',
                                    value: "*".concat(fromWithoutPrefix)
                                }
                            ]
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
                                filterGroups.push({
                                    filters: [
                                        {
                                            propertyName: 'phone',
                                            operator: 'CONTAINS_TOKEN',
                                            value: "*".concat(prefix, "9").concat(tmpPhoneWithoutPrefix)
                                        }
                                    ]
                                });
                            }
                            else {
                                filterGroups.push({
                                    filters: [
                                        {
                                            propertyName: 'phone',
                                            operator: 'CONTAINS_TOKEN',
                                            value: "*".concat(prefix).concat(tmpPhoneWithoutPrefix.slice(1))
                                        }
                                    ]
                                });
                            }
                        }
                    }
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    return [4 /*yield*/, hubspotClient.crm.contacts.searchApi.doSearch({
                            //query: from,
                            filterGroups: filterGroups,
                            //@ts-ignore
                            sorts: [{
                                    propertyName: 'phone',
                                    direction: 'ASCENDING'
                                }],
                            properties: ['firstname', 'lastname', 'lifecyclestage', 'phone'],
                            limit: 1,
                            after: 0
                        }).then(function (contacts) {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            if (contacts.total > 0) {
                                var contact = contacts.results[0];
                                //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
                                result.crmid = "".concat(contact.id); //required for screenpop
                                result.firstname = "".concat(contact.properties.firstname);
                                result.lastname = "".concat(contact.properties.lastname);
                                result.fullname = "".concat((_a = contact.properties.firstname) !== null && _a !== void 0 ? _a : '', " ").concat((_b = contact.properties.lastname) !== null && _b !== void 0 ? _b : '');
                                result.lifecyclestage = "".concat((_d = (_c = contact.properties) === null || _c === void 0 ? void 0 : _c.lifecyclestage) !== null && _d !== void 0 ? _d : 'lead');
                                result.tf_default_queue = (_f = (_e = contact.properties) === null || _e === void 0 ? void 0 : _e.tf_default_queue) !== null && _f !== void 0 ? _f : '';
                                result.tf_default_workflow = (_h = (_g = contact.properties) === null || _g === void 0 ? void 0 : _g.tf_default_workflow) !== null && _h !== void 0 ? _h : '';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hIdWJzcG90Q29udGFjdC5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3R1ZGlvL2ZldGNoSHVic3BvdENvbnRhY3QucHJvdGVjdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQThEO0FBYTlELE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFDZCxPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7OztvQkFHeEIsTUFBTSxHQUFHO3dCQUNULEtBQUssRUFBRSxFQUFFO3dCQUNULFNBQVMsRUFBRSxFQUFFO3dCQUNiLFFBQVEsRUFBRSxFQUFFO3dCQUNaLFFBQVEsRUFBRSxFQUFFO3dCQUNaLGNBQWMsRUFBRSxNQUFNO3dCQUN0QixhQUFhLEVBQUUsTUFBTTt3QkFDckIsZ0JBQWdCLEVBQUUsRUFBRTt3QkFDcEIsbUJBQW1CLEVBQUUsRUFBRTtxQkFDMUIsQ0FBQztvQkFDRSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFFdEIsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTt3QkFDMUIsc0JBQU8sUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLENBQUMsRUFBQztxQkFDbEQ7b0JBRUQsb0VBQW9FO29CQUNwRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3JDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUIsaUJBQWlCLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FB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