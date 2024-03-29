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
exports.handler = void 0;
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
var api_client_1 = require("@hubspot/api-client");
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var hs_bject_id, hs_timestamp, hs_call_body, hs_call_callee_object_type_id, hs_call_direction, hs_call_disposition, hs_call_duration, hs_call_from_number, hs_call_to_number, hs_call_recording_url, hs_call_status, hubspot_owner_id, hubspot_deal_id, hs_call_callee_object_id, response, hubspotClient, fixedNumber, seachedCRMID, toHubspot, call, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hs_bject_id = event.hs_bject_id, hs_timestamp = event.hs_timestamp, hs_call_body = event.hs_call_body, hs_call_callee_object_type_id = event.hs_call_callee_object_type_id, hs_call_direction = event.hs_call_direction, hs_call_disposition = event.hs_call_disposition, hs_call_duration = event.hs_call_duration, hs_call_from_number = event.hs_call_from_number, hs_call_to_number = event.hs_call_to_number, hs_call_recording_url = event.hs_call_recording_url, hs_call_status = event.hs_call_status, hubspot_owner_id = event.hubspot_owner_id, hubspot_deal_id = event.hubspot_deal_id;
                    hs_call_callee_object_id = event.hs_call_callee_object_id;
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!!hs_call_callee_object_id) return [3 /*break*/, 3];
                    fixedNumber = hs_call_direction === 'INBOUND' ? hs_call_from_number : hs_call_to_number;
                    // Remove dash, spaces and parenthesis from the number
                    fixedNumber = fixedNumber.replace(/[- )(]/g, '');
                    return [4 /*yield*/, hubspotClient.crm.contacts.searchApi.doSearch({
                            query: fixedNumber,
                            filterGroups: [],
                            limit: 1,
                            after: 0,
                            sorts: ['phone'],
                            properties: ['hs_object_id']
                        }).then(function (contacts) {
                            if (contacts.results.length > 0) {
                                return contacts.results[0].properties.hs_object_id;
                            }
                            else {
                                return false;
                            }
                        }).catch(function (error) {
                            console.log(error);
                            return false;
                        })];
                case 2:
                    seachedCRMID = _a.sent();
                    if (seachedCRMID !== false) {
                        hs_call_callee_object_id = seachedCRMID;
                    }
                    else {
                        // SI no tenemos CRMID, algo anda mal porque este se crea en inbounds 
                        // y no debería hacer log a contactos inexistentes en HS
                        throw new Error('CRMID Inválido');
                    }
                    _a.label = 3;
                case 3:
                    toHubspot = {
                        'properties': {
                            hs_call_callee_object_id: hs_call_callee_object_id,
                            hs_timestamp: hs_timestamp,
                            hs_call_body: hs_call_body,
                            hs_call_direction: hs_call_direction,
                            hs_call_duration: hs_call_duration,
                            hs_call_from_number: hs_call_from_number,
                            hs_call_to_number: hs_call_to_number,
                            hs_call_recording_url: hs_call_recording_url,
                            hs_call_status: hs_call_status,
                            hs_call_disposition: hs_call_disposition,
                            hubspot_owner_id: hubspot_owner_id
                        },
                        'associations': [
                            {
                                to: {
                                    id: hs_call_callee_object_id
                                },
                                types: [
                                    {
                                        associationCategory: "HUBSPOT_DEFINED",
                                        associationTypeId: 194
                                    }
                                ]
                            }
                        ]
                    };
                    if (hubspot_deal_id !== undefined && hubspot_deal_id !== null) {
                        toHubspot.associations.push({
                            to: {
                                id: hubspot_deal_id
                            },
                            types: [
                                {
                                    associationCategory: "HUBSPOT_DEFINED",
                                    associationTypeId: 206
                                }
                            ]
                        });
                    }
                    return [4 /*yield*/, hubspotClient.crm.objects.calls.basicApi.create(toHubspot)
                            .then(function (call) { return call; })
                            .catch(function (err) {
                            console.error(err);
                            return {};
                        })];
                case 4:
                    call = _a.sent();
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody(call);
                    return [2 /*return*/, callback(null, response)];
                case 5:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        response.appendHeader("Content-Type", "plain/text");
                        response.setBody(err_1.message);
                        response.setStatusCode(500);
                        // If there's an error, send an error response
                        // Keep using the response object for CORS purposes
                        console.error(err_1);
                        callback(null, response);
                    }
                    else {
                        callback(null, {});
                    }
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nQ2FsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dDYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJFQUEwRjtBQUMxRixrREFBOEQ7QUEyQjlELFlBQVk7QUFDQyxRQUFBLE9BQU8sR0FBRyxJQUFBLCtDQUFzQixFQUFDLFVBQzVDLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0Qjs7Ozs7O29CQUkxQixXQUFXLEdBYVQsS0FBSyxZQWJJLEVBQ1gsWUFBWSxHQVlWLEtBQUssYUFaSyxFQUNaLFlBQVksR0FXVixLQUFLLGFBWEssRUFDWiw2QkFBNkIsR0FVM0IsS0FBSyw4QkFWc0IsRUFDN0IsaUJBQWlCLEdBU2YsS0FBSyxrQkFUVSxFQUNqQixtQkFBbUIsR0FRakIsS0FBSyxvQkFSWSxFQUNuQixnQkFBZ0IsR0FPZCxLQUFLLGlCQVBTLEVBQ2hCLG1CQUFtQixHQU1qQixLQUFLLG9CQU5ZLEVBQ25CLGlCQUFpQixHQUtmLEtBQUssa0JBTFUsRUFDakIscUJBQXFCLEdBSW5CLEtBQUssc0JBSmMsRUFDckIsY0FBYyxHQUdaLEtBQUssZUFITyxFQUNkLGdCQUFnQixHQUVkLEtBQUssaUJBRlMsRUFDaEIsZUFBZSxHQUNiLEtBQUssZ0JBRFEsQ0FDUjtvQkFFTCx3QkFBd0IsR0FBRyxLQUFLLENBQUMsd0JBQXdCLENBQUE7b0JBRXZELFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDdkMsUUFBUSxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUQsUUFBUSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO29CQUMxRSxRQUFRLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUVoRSxhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFBOzs7O3lCQUV6RSxDQUFDLHdCQUF3QixFQUF6Qix3QkFBeUI7b0JBQ3ZCLFdBQVcsR0FBRyxpQkFBaUIsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQTtvQkFDM0Ysc0RBQXNEO29CQUN0RCxXQUFXLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUE7b0JBR1IscUJBQU0sYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzs0QkFDMUYsS0FBSyxFQUFFLFdBQVc7NEJBQ2xCLFlBQVksRUFBRSxFQUFFOzRCQUNoQixLQUFLLEVBQUUsQ0FBQzs0QkFDUixLQUFLLEVBQUUsQ0FBQzs0QkFDUixLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUM7NEJBQ2hCLFVBQVUsRUFBRSxDQUFDLGNBQWMsQ0FBQzt5QkFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLFFBQW9FOzRCQUMzRSxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQ0FDL0IsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFzQixDQUFBOzZCQUM3RDtpQ0FBTTtnQ0FDTCxPQUFPLEtBQUssQ0FBQzs2QkFDZDt3QkFDSCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxLQUFLOzRCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7NEJBQ2xCLE9BQU8sS0FBSyxDQUFBO3dCQUNkLENBQUMsQ0FBQyxFQUFBOztvQkFoQkksWUFBWSxHQUFzQixTQWdCdEM7b0JBRUYsSUFBSSxZQUFZLEtBQUssS0FBSyxFQUFFO3dCQUMxQix3QkFBd0IsR0FBRyxZQUFzQixDQUFBO3FCQUNsRDt5QkFBTTt3QkFDTCxzRUFBc0U7d0JBQ3RFLHdEQUF3RDt3QkFDeEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3FCQUNuQzs7O29CQUdHLFNBQVMsR0FBc0M7d0JBQ25ELFlBQVksRUFBRTs0QkFDWix3QkFBd0IsMEJBQUE7NEJBQ3hCLFlBQVksY0FBQTs0QkFDWixZQUFZLGNBQUE7NEJBQ1osaUJBQWlCLG1CQUFBOzRCQUNqQixnQkFBZ0Isa0JBQUE7NEJBQ2hCLG1CQUFtQixxQkFBQTs0QkFDbkIsaUJBQWlCLG1CQUFBOzRCQUNqQixxQkFBcUIsdUJBQUE7NEJBQ3JCLGNBQWMsZ0JBQUE7NEJBQ2QsbUJBQW1CLHFCQUFBOzRCQUNuQixnQkFBZ0Isa0JBQUE7eUJBQ2pCO3dCQUNELGNBQWMsRUFBRTs0QkFDZDtnQ0FDRSxFQUFFLEVBQUU7b0NBQ0YsRUFBRSxFQUFFLHdCQUF3QjtpQ0FDN0I7Z0NBQ0QsS0FBSyxFQUFFO29DQUNMO3dDQUNFLG1CQUFtQixFQUFFLGlCQUFpQjt3Q0FDdEMsaUJBQWlCLEVBQUUsR0FBRztxQ0FDdkI7aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7cUJBQ0YsQ0FBQztvQkFFRixJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLElBQUksRUFBRTt3QkFDN0QsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7NEJBQzFCLEVBQUUsRUFBRTtnQ0FDRixFQUFFLEVBQUUsZUFBZTs2QkFDcEI7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMO29DQUNFLG1CQUFtQixFQUFFLGlCQUFpQjtvQ0FDdEMsaUJBQWlCLEVBQUUsR0FBRztpQ0FDdkI7NkJBQ0Y7eUJBQ0YsQ0FBQyxDQUFBO3FCQUNIO29CQUVZLHFCQUFNLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzs2QkFDMUUsSUFBSSxDQUFDLFVBQUMsSUFBd0IsSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLENBQUM7NkJBQ3hDLEtBQUssQ0FBQyxVQUFDLEdBQUc7NEJBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDbkIsT0FBTyxFQUFFLENBQUE7d0JBQ1gsQ0FBQyxDQUFDLEVBQUE7O29CQUxFLElBQUksR0FBRyxTQUtUO29CQUVKLFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7b0JBQzFELFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXZCLHNCQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUM7OztvQkFFaEMsSUFBSSxLQUFHLFlBQVksS0FBSyxFQUFFO3dCQUN4QixRQUFRLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQzt3QkFDcEQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzlCLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzVCLDhDQUE4Qzt3QkFDOUMsbURBQW1EO3dCQUNuRCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUcsQ0FBQyxDQUFDO3dCQUNuQixRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUMxQjt5QkFBTTt3QkFDTCxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUNwQjs7Ozs7O0NBR0osQ0FBQyxDQUFBIn0=