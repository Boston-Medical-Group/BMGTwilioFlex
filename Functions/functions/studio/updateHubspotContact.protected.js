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
                    return [4 /*yield*/, hubspotClient.crm.contacts.basicApi.update(event.crmid, {
                            properties: {
                                tf_inbound_ddi: to.replace(/\s/g, ""),
                                tf_inbound_date: "".concat((new Date).getTime()),
                            }
                        }).then(function (contact) {
                            var _a, _b, _c, _d;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlSHVic3BvdENvbnRhY3QucHJvdGVjdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0dWRpby91cGRhdGVIdWJzcG90Q29udGFjdC5wcm90ZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBOEQ7QUFtQjlELE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFDaEIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCOzs7Ozs7b0JBRXhCLE1BQU0sR0FBRzt3QkFDWCxLQUFLLEVBQUUsRUFBRTt3QkFDVCxTQUFTLEVBQUUsRUFBRTt3QkFDYixRQUFRLEVBQUUsRUFBRTt3QkFDWixRQUFRLEVBQUUsRUFBRTt3QkFDWixjQUFjLEVBQUUsRUFBRTtxQkFDbkIsQ0FBQztvQkFDRSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDbEIsRUFBRSxHQUFLLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBRXBCLG9FQUFvRTtvQkFDcEUsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNyQyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBRTNCLGFBQWEsR0FBRyxJQUFJLG1CQUFhLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7b0JBQy9FLHFCQUFNLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTs0QkFDNUQsVUFBVSxFQUFFO2dDQUNWLGNBQWMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7Z0NBQ3JDLGVBQWUsRUFBRSxVQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBRTs2QkFDM0M7eUJBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLE9BQTRCOzs0QkFDNUMscUlBQXFJOzRCQUNySSxNQUFNLENBQUMsS0FBSyxHQUFHLFVBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsd0JBQXdCOzRCQUN4RCxNQUFNLENBQUMsU0FBUyxHQUFHLFVBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUUsQ0FBQzs0QkFDckQsTUFBTSxDQUFDLFFBQVEsR0FBRyxVQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFFLENBQUM7NEJBQ25ELE1BQU0sQ0FBQyxRQUFRLEdBQUcsVUFBRyxNQUFBLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxtQ0FBSSxFQUFFLGNBQUksTUFBQSxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsbUNBQUksRUFBRSxDQUFFLENBQUM7NEJBQy9GLE1BQU0sQ0FBQyxjQUFjLEdBQUcsVUFBRyxNQUFBLE1BQUEsT0FBTyxDQUFDLFVBQVUsMENBQUUsY0FBYyxtQ0FBSSxNQUFNLENBQUUsQ0FBQzs0QkFDMUUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO2dDQUNqQyxNQUFNLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQTs0QkFDOUIsQ0FBQzs0QkFFRCxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUN6QixDQUFDLENBQUM7NkJBQ0MsS0FBSyxDQUFDLFVBQVUsS0FBSzs0QkFDcEIsZUFBZTs0QkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFVLEtBQUssQ0FBRSxDQUFDLENBQUM7NEJBQy9CLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQ3hCLENBQUMsQ0FBQyxFQUFBOztvQkF0QkosU0FzQkksQ0FBQzs7Ozs7Q0FDTixDQUFDIn0=