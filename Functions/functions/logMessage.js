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
var getHtmlMessage = function (messages) { return __awaiter(void 0, void 0, void 0, function () {
    var resultHtml, bgColor_1;
    return __generator(this, function (_a) {
        resultHtml = '<ul style="list-style:none;padding:0;">';
        try {
            bgColor_1 = 'transparent';
            messages.forEach(function (message) {
                bgColor_1 = bgColor_1 === 'transparent' ? '#0091ae12' : 'transparent';
                resultHtml += "<li style=\"background-color: ".concat(bgColor_1, ";border: 1px solid #cfdae1;padding: 5px;margin-bottom: 4px;\"><div style=\"color: #5d7185;font-weight: bold;margin-bottom:5px;\"><span class=\"\">").concat(message.author, "</span> - <span style=\"color: #738ba3;font-size: 9px;\">").concat(message.dateCreated.toLocaleString(), "</span></div><div style=\"padding: 6px;color: #333f4d;\"><p>").concat(message.body, "</p></div></li>");
            });
            resultHtml += '</ul>';
        }
        catch (err) {
            console.error("Oeps, something is wrong ".concat(err));
        }
        return [2 /*return*/, resultHtml];
    });
}); };
var getMessages = function (context, conversationSid) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                messages = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, context.getTwilioClient().conversations.v1.conversations(conversationSid)
                        .messages
                        .list({ limit: 500 })];
            case 2:
                messages = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error("Oeps, something is wrong ".concat(err_1));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, messages];
        }
    });
}); };
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var conversationSid, hubspot_contact_id, hubspot_deal_id, hs_communication_channel_type, hs_communication_logged_from, hs_communication_body, hs_timestamp, hubspot_owner_id, response, hubspotClient, logBody, conversationMessages, _a, toHubspot, communication, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    conversationSid = event.conversationSid, hubspot_contact_id = event.hubspot_contact_id, hubspot_deal_id = event.hubspot_deal_id, hs_communication_channel_type = event.hs_communication_channel_type, hs_communication_logged_from = event.hs_communication_logged_from, hs_communication_body = event.hs_communication_body, hs_timestamp = event.hs_timestamp, hubspot_owner_id = event.hubspot_owner_id;
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    if (!hubspot_contact_id) {
                        throw new Error('CRMID Inválido');
                    }
                    logBody = hs_communication_body;
                    logBody += '<br /><br />';
                    return [4 /*yield*/, getMessages(context, conversationSid)];
                case 2:
                    conversationMessages = _b.sent();
                    _a = logBody;
                    return [4 /*yield*/, getHtmlMessage(conversationMessages)];
                case 3:
                    logBody = _a + _b.sent();
                    toHubspot = {
                        properties: {
                            hs_communication_channel_type: hs_communication_channel_type,
                            hs_communication_logged_from: hs_communication_logged_from,
                            hs_communication_body: logBody,
                            hs_timestamp: hs_timestamp,
                            hubspot_owner_id: hubspot_owner_id
                        },
                        associations: [
                            {
                                to: {
                                    id: hubspot_contact_id
                                },
                                types: [
                                    {
                                        associationCategory: "HUBSPOT_DEFINED",
                                        associationTypeId: 81
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
                                    associationTypeId: 85
                                }
                            ]
                        });
                    }
                    return [4 /*yield*/, hubspotClient.crm.objects.communications.basicApi.create(toHubspot)];
                case 4:
                    communication = _b.sent();
                    response.setBody(communication);
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    if (err_2 instanceof Error) {
                        response.setBody(err_2);
                        response.setStatusCode(500);
                        // If there's an error, send an error response
                        // Keep using the response object for CORS purposes
                        console.error(err_2);
                    }
                    else {
                        response.setBody({});
                    }
                    return [3 /*break*/, 6];
                case 6:
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJFQUFrRjtBQUdsRixrREFBOEQ7QUFJOUQsSUFBTSxjQUFjLEdBQUcsVUFBTyxRQUE0Qjs7O1FBQ2xELFVBQVUsR0FBRyx5Q0FBeUMsQ0FBQztRQUUzRCxJQUFJO1lBRUksWUFBVSxhQUFhLENBQUM7WUFDNUIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87Z0JBQ3BCLFNBQU8sR0FBRyxTQUFPLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFDbEUsVUFBVSxJQUFJLHdDQUFnQyxTQUFPLCtKQUFnSixPQUFPLENBQUMsTUFBTSxzRUFBMEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUseUVBQTZELE9BQU8sQ0FBQyxJQUFJLG9CQUFpQixDQUFBO1lBQy9ZLENBQUMsQ0FBQyxDQUFBO1lBRUYsVUFBVSxJQUFJLE9BQU8sQ0FBQztTQUV6QjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBNEIsR0FBRyxDQUFFLENBQUMsQ0FBQztTQUNwRDtRQUVELHNCQUFPLFVBQVUsRUFBQzs7S0FDckIsQ0FBQTtBQUVELElBQU0sV0FBVyxHQUFHLFVBQU8sT0FBaUIsRUFBRSxlQUF3Qjs7Ozs7Z0JBQzlELFFBQVEsR0FBUyxFQUFFLENBQUM7Ozs7Z0JBRVQscUJBQU0sT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQzt5QkFDckYsUUFBUTt5QkFDUixJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBQTs7Z0JBRnpCLFFBQVEsR0FBRyxT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