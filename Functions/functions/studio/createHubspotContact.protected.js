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
/** Receives a phone number, queries HUBSPOT and returns the customer record.
* If the CRM has a duplicate number, the function returns the first record (usually the oldest)
*/
var countryMap = {
    ecu: 'EC',
    can: 'CA',
    mex: 'MX',
    col: 'CO',
    arg: 'AR',
    esp: 'ES',
    spa: 'ES',
    per: 'PE',
    ale: 'DE',
    deu: 'DE',
    bra: 'BR',
    dev: 'ES',
};
exports.handler = function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var result, from, to, hubspotClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = {
                        crmid: '',
                        firstname: '',
                        lastname: '',
                        fullname: '',
                        lifecyclestage: ''
                    };
                    from = event.from;
                    to = event.to;
                    //if the string from contains a whatsapp prefix we need to remove it
                    from = from.replace('whatsapp:', '');
                    to = to.replace('whatsapp:', '');
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    return [4 /*yield*/, hubspotClient.crm.contacts.basicApi.create({
                            properties: {
                                firstname: 'Anonymous',
                                lastname: 'Contact',
                                phone: from,
                                hs_lead_status: 'NEW',
                                tipo_de_lead: 'Llamada',
                                country: countryMap[context.COUNTRY],
                                tf_inbound_ddi: to.replace(/\s/g, ""),
                                tf_inbound_date: "".concat((new Date()).getTime())
                            },
                            associations: []
                        }).then(function (contact) {
                            var _a, _b, _c, _d;
                            console.log(contact);
                            //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
                            result.crmid = "".concat(contact.id); //required for screenpop
                            result.firstname = "".concat(contact.properties.firstname);
                            result.lastname = "".concat(contact.properties.lastname);
                            result.fullname = "".concat((_a = contact.properties.firstname) !== null && _a !== void 0 ? _a : '', " ").concat((_b = contact.properties.lastname) !== null && _b !== void 0 ? _b : '');
                            result.lifecyclestage = "".concat((_d = (_c = contact.properties) === null || _c === void 0 ? void 0 : _c.lifecyclestage) !== null && _d !== void 0 ? _d : 'lead');
                            if (result.fullname.trim() == '') {
                                result.fullname = 'Customer';
                            }
                            callback(null, result);
                        })
                            .catch(function (error) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlSHVic3BvdENvbnRhY3QucHJvdGVjdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0dWRpby9jcmVhdGVIdWJzcG90Q29udGFjdC5wcm90ZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBOEQ7QUFJOUQ7O0VBRUU7QUFFRixJQUFNLFVBQVUsR0FBK0I7SUFDN0MsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0NBQ1YsQ0FBQztBQVlGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFDaEIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCOzs7Ozs7b0JBRXhCLE1BQU0sR0FBRzt3QkFDWCxLQUFLLEVBQUUsRUFBRTt3QkFDVCxTQUFTLEVBQUUsRUFBRTt3QkFDYixRQUFRLEVBQUUsRUFBRTt3QkFDWixRQUFRLEVBQUUsRUFBRTt3QkFDWixjQUFjLEVBQUUsRUFBRTtxQkFDbkIsQ0FBQztvQkFDRSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDbEIsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBRWxCLG9FQUFvRTtvQkFDcEUsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNyQyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBRTNCLGFBQWEsR0FBRyxJQUFJLG1CQUFhLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7b0JBRS9FLHFCQUFNLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7NEJBQy9DLFVBQVUsRUFBRTtnQ0FDVixTQUFTLEVBQUUsV0FBVztnQ0FDdEIsUUFBUSxFQUFFLFNBQVM7Z0NBQ25CLEtBQUssRUFBRSxJQUFJO2dDQUNYLGNBQWMsRUFBRSxLQUFLO2dDQUNyQixZQUFZLEVBQUUsU0FBUztnQ0FDdkIsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2dDQUNwQyxjQUFjLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO2dDQUNyQyxlQUFlLEVBQUUsVUFBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBRTs2QkFDN0M7NEJBQ0QsWUFBWSxFQUFFLEVBQUU7eUJBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxPQUE0Qjs7NEJBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7NEJBQ3BCLHFJQUFxSTs0QkFDckksTUFBTSxDQUFDLEtBQUssR0FBRyxVQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLHdCQUF3Qjs0QkFDeEQsTUFBTSxDQUFDLFNBQVMsR0FBRyxVQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFFLENBQUM7NEJBQ3JELE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBRSxDQUFDOzRCQUNuRCxNQUFNLENBQUMsUUFBUSxHQUFHLFVBQUcsTUFBQSxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsbUNBQUksRUFBRSxjQUFJLE1BQUEsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLG1DQUFJLEVBQUUsQ0FBRSxDQUFDOzRCQUMvRixNQUFNLENBQUMsY0FBYyxHQUFHLFVBQUcsTUFBQSxNQUFBLE9BQU8sQ0FBQyxVQUFVLDBDQUFFLGNBQWMsbUNBQUksTUFBTSxDQUFFLENBQUM7NEJBQzFFLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0NBQ2hDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFBOzZCQUM3Qjs0QkFFRCxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUN6QixDQUFDLENBQUM7NkJBQ0MsS0FBSyxDQUFDLFVBQVUsS0FBSzs0QkFDcEIsZUFBZTs0QkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFVLEtBQUssQ0FBRSxDQUFDLENBQUM7NEJBQy9CLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3hCLENBQUMsQ0FBQyxFQUFBOztvQkE5QkosU0E4QkksQ0FBQzs7Ozs7Q0FDTixDQUFDIn0=