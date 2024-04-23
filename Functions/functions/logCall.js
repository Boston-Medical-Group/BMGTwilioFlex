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
        var hs_bject_id, hs_timestamp, hs_call_body, hs_call_callee_object_type_id, hs_call_direction, hs_call_disposition, hs_call_duration, hs_call_from_number, hs_call_to_number, hs_call_recording_url, hs_call_status, hubspot_owner_id, hubspot_deal_id, hs_call_title, hs_call_callee_object_id, response, hubspotClient, fixedNumberOrig, fixedNumber, seachedCRMID, toHubspot, call, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hs_bject_id = event.hs_bject_id, hs_timestamp = event.hs_timestamp, hs_call_body = event.hs_call_body, hs_call_callee_object_type_id = event.hs_call_callee_object_type_id, hs_call_direction = event.hs_call_direction, hs_call_disposition = event.hs_call_disposition, hs_call_duration = event.hs_call_duration, hs_call_from_number = event.hs_call_from_number, hs_call_to_number = event.hs_call_to_number, hs_call_recording_url = event.hs_call_recording_url, hs_call_status = event.hs_call_status, hubspot_owner_id = event.hubspot_owner_id, hubspot_deal_id = event.hubspot_deal_id, hs_call_title = event.hs_call_title;
                    hs_call_callee_object_id = event.hs_call_callee_object_id;
                    // LOG SIN GRABACIÓN
                    if (!hs_call_recording_url || hs_call_recording_url === null) {
                        console.log('No recording URL for', hs_call_callee_object_id, hs_call_from_number, hs_call_to_number);
                    }
                    // Debug task Attributes
                    if (event.taskAttributes) {
                        console.log('TASKATTRIBUTES', JSON.stringify(event.taskAttributes));
                    }
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!!hs_call_callee_object_id) return [3 /*break*/, 3];
                    fixedNumberOrig = hs_call_direction === 'INBOUND' ? hs_call_from_number : hs_call_to_number;
                    fixedNumber = fixedNumberOrig.replace(/[- )(]/g, '');
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
                        console.log('No CRMID found for', fixedNumberOrig);
                        throw new Error('CRMID Inválido');
                    }
                    _a.label = 3;
                case 3:
                    toHubspot = {
                        'properties': {
                            hs_call_title: hs_call_title,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nQ2FsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dDYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJFQUEwRjtBQUMxRixrREFBOEQ7QUE2QjlELFlBQVk7QUFDQyxRQUFBLE9BQU8sR0FBRyxJQUFBLCtDQUFzQixFQUFDLFVBQzVDLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0Qjs7Ozs7O29CQUkxQixXQUFXLEdBY1QsS0FBSyxZQWRJLEVBQ1gsWUFBWSxHQWFWLEtBQUssYUFiSyxFQUNaLFlBQVksR0FZVixLQUFLLGFBWkssRUFDWiw2QkFBNkIsR0FXM0IsS0FBSyw4QkFYc0IsRUFDN0IsaUJBQWlCLEdBVWYsS0FBSyxrQkFWVSxFQUNqQixtQkFBbUIsR0FTakIsS0FBSyxvQkFUWSxFQUNuQixnQkFBZ0IsR0FRZCxLQUFLLGlCQVJTLEVBQ2hCLG1CQUFtQixHQU9qQixLQUFLLG9CQVBZLEVBQ25CLGlCQUFpQixHQU1mLEtBQUssa0JBTlUsRUFDakIscUJBQXFCLEdBS25CLEtBQUssc0JBTGMsRUFDckIsY0FBYyxHQUlaLEtBQUssZUFKTyxFQUNkLGdCQUFnQixHQUdkLEtBQUssaUJBSFMsRUFDaEIsZUFBZSxHQUViLEtBQUssZ0JBRlEsRUFDZixhQUFhLEdBQ1gsS0FBSyxjQURNLENBQ047b0JBRUwsd0JBQXdCLEdBQUcsS0FBSyxDQUFDLHdCQUF3QixDQUFBO29CQUU3RCxvQkFBb0I7b0JBQ3BCLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxxQkFBcUIsS0FBSyxJQUFJLEVBQUU7d0JBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsd0JBQXdCLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQTtxQkFDdEc7b0JBRUQsd0JBQXdCO29CQUN4QixJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7d0JBQ3hCLE9BQU8s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