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
        var contactId, property, value, check, properties, hubspotClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contactId = event.contactId, property = event.property, value = event.value;
                    check = false;
                    if (typeof property === 'string' && typeof value === 'string') {
                        check = true;
                    }
                    else if (Array.isArray(property) && Array.isArray(value)) {
                        if (property.length === value.length) {
                            check = true;
                        }
                    }
                    // Validar propiedades
                    if (!check) {
                        return [2 /*return*/, callback('Both property and value should be a string or an array with the items length for property and value')];
                    }
                    properties = {};
                    if (typeof property === 'string') {
                        //@ts-ignore
                        properties[property] = value;
                    }
                    else if (Array.isArray(property)) {
                        properties = property.reduce(function (map, key, index) {
                            //@ts-ignore
                            map[key] = value[index];
                            return map;
                        }, {});
                    }
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    return [4 /*yield*/, hubspotClient.crm.contacts.basicApi.update(contactId, {
                            properties: properties
                        }).then(function (contact) {
                            //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
                            callback(null, {});
                        }).catch(function (error) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlQ29udGFjdFByb3BlcnR5LnByb3RlY3RlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdHVkaW8vaHVic3BvdC91cGRhdGVDb250YWN0UHJvcGVydHkucHJvdGVjdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQThEO0FBd0I5RCxPQUFPLENBQUMsT0FBTyxHQUFHLFVBQ2QsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCOzs7Ozs7b0JBR3RCLFNBQVMsR0FBc0IsS0FBSyxVQUEzQixFQUFFLFFBQVEsR0FBWSxLQUFLLFNBQWpCLEVBQUUsS0FBSyxHQUFLLEtBQUssTUFBVixDQUFXO29CQUd2QyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNsQixJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7d0JBQzNELEtBQUssR0FBRyxJQUFJLENBQUM7cUJBQ2hCO3lCQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUN4RCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTs0QkFDbEMsS0FBSyxHQUFHLElBQUksQ0FBQzt5QkFDaEI7cUJBQ0o7b0JBRUQsc0JBQXNCO29CQUN0QixJQUFJLENBQUMsS0FBSyxFQUFFO3dCQUNSLHNCQUFPLFFBQVEsQ0FBQyxxR0FBcUcsQ0FBQyxFQUFBO3FCQUN6SDtvQkFFRyxVQUFVLEdBQThCLEVBQUksQ0FBQztvQkFDakQsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7d0JBQzlCLFlBQVk7d0JBQ1osVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztxQkFDaEM7eUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUNoQyxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSzs0QkFDekMsWUFBWTs0QkFDWixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUN4QixPQUFPLEdBQUcsQ0FBQzt3QkFDZixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQ1Y7b0JBRUssYUFBYSxHQUFHLElBQUksbUJBQWEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtvQkFDL0UscUJBQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7NEJBQ3hELFVBQVUsWUFBQTt5QkFDYixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsT0FBMkI7NEJBQ3pDLHFJQUFxSTs0QkFDckksUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDdkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSzs0QkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBVSxLQUFLLENBQUUsQ0FBQyxDQUFDOzRCQUMvQixRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUMxQixDQUFDLENBQUMsRUFBQTs7b0JBUkYsU0FRRSxDQUFDOzs7OztDQUNOLENBQUMifQ==