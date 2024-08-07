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
        var objectType, objectId, property, value, check, props, hubspotClient, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    objectType = event.objectType, objectId = event.objectId, property = event.property, value = event.value;
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
                    props = {};
                    if (typeof property === 'string') {
                        //@ts-ignore
                        props[property] = value;
                    }
                    else if (Array.isArray(property)) {
                        props = property.reduce(function (map, key, index) {
                            //@ts-ignore
                            map[key] = value[index];
                            return map;
                        }, {});
                    }
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    console.info(props);
                    console.info('Updating properties : ' + JSON.stringify(props));
                    return [4 /*yield*/, hubspotClient.crm.objects.basicApi.update(objectType, objectId, {
                            properties: props
                        }).then(function (contact) {
                            //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
                            result = {};
                        }).catch(function (error) {
                            result = { error: "Error updateObjectProperty@67: ".concat(error) };
                        })];
                case 1:
                    _a.sent();
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody(result);
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlT2JqZWN0UHJvcGVydHkucHJvdGVjdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N0dWRpby9odWJzcG90L3VwZGF0ZU9iamVjdFByb3BlcnR5LnByb3RlY3RlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUE4RDtBQXlCOUQsT0FBTyxDQUFDLE9BQU8sR0FBRyxVQUNkLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0Qjs7Ozs7O29CQUd0QixVQUFVLEdBQWdDLEtBQUssV0FBckMsRUFBRSxRQUFRLEdBQXNCLEtBQUssU0FBM0IsRUFBRSxRQUFRLEdBQVksS0FBSyxTQUFqQixFQUFFLEtBQUssR0FBSyxLQUFLLE1BQVYsQ0FBVztvQkFFbEQsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbEIsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO3dCQUMzRCxLQUFLLEdBQUcsSUFBSSxDQUFDO3FCQUNoQjt5QkFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDeEQsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQ2xDLEtBQUssR0FBRyxJQUFJLENBQUM7eUJBQ2hCO3FCQUNKO29CQUVELHNCQUFzQjtvQkFDdEIsSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFDUixzQkFBTyxRQUFRLENBQUMscUdBQXFHLENBQUMsRUFBQTtxQkFDekg7b0JBRUcsS0FBSyxHQUE4QixFQUFJLENBQUM7b0JBQzVDLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO3dCQUM5QixZQUFZO3dCQUNaLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7cUJBQzNCO3lCQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDaEMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUs7NEJBQ3BDLFlBQVk7NEJBQ1osR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDeEIsT0FBTyxHQUFHLENBQUM7d0JBQ2YsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUNWO29CQUVLLGFBQWEsR0FBRyxJQUFJLG1CQUFhLENBQUMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7b0JBQy9FLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUUvRCxxQkFBTSxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUU7NEJBQ2xFLFVBQVUsRUFBRSxLQUFLO3lCQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsT0FBMkI7NEJBQ3pDLHFJQUFxSTs0QkFDckksTUFBTSxHQUFHLEVBQUUsQ0FBQTt3QkFDZixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUUsVUFBVSxLQUFLOzRCQUNyQixNQUFNLEdBQUcsRUFBRSxLQUFLLEVBQUUseUNBQWtDLEtBQUssQ0FBRSxFQUFFLENBQUE7d0JBQ2pFLENBQUMsQ0FBQyxFQUFBOztvQkFQRixTQU9FLENBQUM7b0JBRUcsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMxRCxRQUFRLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQzFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBQ3RFLFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQzFELFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBRXpCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Ozs7O0NBQzVCLENBQUMifQ==