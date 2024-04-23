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
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var hs_bject_id, hs_timestamp, hs_call_body, hs_call_callee_object_type_id, hs_call_direction, hs_call_disposition, hs_call_duration, hs_call_from_number, hs_call_to_number, hs_call_recording_url, hs_call_status, hubspot_owner_id, hubspot_deal_id, hs_call_title, hs_call_callee_object_id, recordingUrl, client, response, hubspotClient, fixedNumberOrig, fixedNumber, seachedCRMID, toHubspot, call, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    hs_bject_id = event.hs_bject_id, hs_timestamp = event.hs_timestamp, hs_call_body = event.hs_call_body, hs_call_callee_object_type_id = event.hs_call_callee_object_type_id, hs_call_direction = event.hs_call_direction, hs_call_disposition = event.hs_call_disposition, hs_call_duration = event.hs_call_duration, hs_call_from_number = event.hs_call_from_number, hs_call_to_number = event.hs_call_to_number, hs_call_recording_url = event.hs_call_recording_url, hs_call_status = event.hs_call_status, hubspot_owner_id = event.hubspot_owner_id, hubspot_deal_id = event.hubspot_deal_id, hs_call_title = event.hs_call_title;
                    hs_call_callee_object_id = event.hs_call_callee_object_id;
                    recordingUrl = hs_call_recording_url;
                    if (!(!hs_call_recording_url || hs_call_recording_url === null)) return [3 /*break*/, 2];
                    console.log('No recording URL for', hs_call_callee_object_id, hs_call_from_number, hs_call_to_number);
                    if (!(event.taskAttributes && ((_a = event.taskAttributes.conference) === null || _a === void 0 ? void 0 : _a.sid))) return [3 /*break*/, 2];
                    client = context.getTwilioClient();
                    return [4 /*yield*/, client.recordings.list({
                            conferenceSid: (_b = event.taskAttributes.conference) === null || _b === void 0 ? void 0 : _b.sid
                        }).then(function (recordings) {
                            var _a, _b;
                            console.log('Fetched recording from conference', (_a = event.taskAttributes.conference) === null || _a === void 0 ? void 0 : _a.sid);
                            recordingUrl = (_b = recordings[0].mediaUrl) !== null && _b !== void 0 ? _b : '';
                        })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 7, , 8]);
                    if (!!hs_call_callee_object_id) return [3 /*break*/, 5];
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
                case 4:
                    seachedCRMID = _c.sent();
                    if (seachedCRMID !== false) {
                        hs_call_callee_object_id = seachedCRMID;
                    }
                    else {
                        // SI no tenemos CRMID, algo anda mal porque este se crea en inbounds 
                        // y no debería hacer log a contactos inexistentes en HS
                        console.log('No CRMID found for', fixedNumberOrig);
                        throw new Error('CRMID Inválido');
                    }
                    _c.label = 5;
                case 5:
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
                            hs_call_recording_url: recordingUrl,
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
                case 6:
                    call = _c.sent();
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody(call);
                    return [2 /*return*/, callback(null, response)];
                case 7:
                    err_1 = _c.sent();
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
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nQ2FsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dDYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJFQUEwRjtBQUMxRixrREFBOEQ7QUE2QjlELFlBQVk7QUFDQyxRQUFBLE9BQU8sR0FBRyxJQUFBLCtDQUFzQixFQUFDLFVBQzVDLE9BQTJCLEVBQzNCLEtBQWMsRUFDZCxRQUE0Qjs7Ozs7OztvQkFJMUIsV0FBVyxHQWNULEtBQUssWUFkSSxFQUNYLFlBQVksR0FhVixLQUFLLGFBYkssRUFDWixZQUFZLEdBWVYsS0FBSyxhQVpLLEVBQ1osNkJBQTZCLEdBVzNCLEtBQUssOEJBWHNCLEVBQzdCLGlCQUFpQixHQVVmLEtBQUssa0JBVlUsRUFDakIsbUJBQW1CLEdBU2pCLEtBQUssb0JBVFksRUFDbkIsZ0JBQWdCLEdBUWQsS0FBSyxpQkFSUyxFQUNoQixtQkFBbUIsR0FPakIsS0FBSyxvQkFQWSxFQUNuQixpQkFBaUIsR0FNZixLQUFLLGtCQU5VLEVBQ2pCLHFCQUFxQixHQUtuQixLQUFLLHNCQUxjLEVBQ3JCLGNBQWMsR0FJWixLQUFLLGVBSk8sRUFDZCxnQkFBZ0IsR0FHZCxLQUFLLGlCQUhTLEVBQ2hCLGVBQWUsR0FFYixLQUFLLGdCQUZRLEVBQ2YsYUFBYSxHQUNYLEtBQUssY0FETSxDQUNOO29CQUVMLHdCQUF3QixHQUFHLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQTtvQkFFekQsWUFBWSxHQUFHLHFCQUFxQixDQUFDO3lCQUNyQyxDQUFBLENBQUMscUJBQXFCLElBQUkscUJBQXFCLEtBQUssSUFBSSxDQUFBLEVBQXhELHdCQUF3RDtvQkFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSx3QkFBd0IsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBO3lCQUNqRyxDQUFBLEtBQUssQ0FBQyxjQUFjLEtBQUksTUFB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