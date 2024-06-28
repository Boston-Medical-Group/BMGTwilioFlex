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
var getMessages = function (context, conversation) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                messages = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, conversation
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
var handler = function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var conversationSid, hubspot_contact_id, hubspot_deal_id, hs_communication_channel_type, hs_communication_logged_from, hs_communication_body, hubspot_owner_id, response, hubspotClient, conversationContext, conversation, hs_timestamp, logBody, conversationMessages, _a, toHubspot, communication, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    conversationSid = event.conversationSid, hubspot_contact_id = event.hubspot_contact_id, hubspot_deal_id = event.hubspot_deal_id, hs_communication_channel_type = event.hs_communication_channel_type, hs_communication_logged_from = event.hs_communication_logged_from, hs_communication_body = event.hs_communication_body, hubspot_owner_id = event.hubspot_owner_id;
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    hubspotClient = new api_client_1.Client({ accessToken: context.HUBSPOT_TOKEN });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    if (!hubspot_contact_id) {
                        throw new Error('CRMID Inválido');
                    }
                    conversationContext = context.getTwilioClient().conversations.v1.conversations(conversationSid);
                    return [4 /*yield*/, conversationContext.fetch()];
                case 2:
                    conversation = _b.sent();
                    hs_timestamp = '';
                    if (conversation) {
                        hs_timestamp = conversation.dateCreated.toUTCString();
                    }
                    logBody = hs_communication_body;
                    logBody += '<br /><br />';
                    return [4 /*yield*/, getMessages(context, conversationContext)];
                case 3:
                    conversationMessages = _b.sent();
                    _a = logBody;
                    return [4 /*yield*/, getHtmlMessage(conversationMessages)];
                case 4:
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
                case 5:
                    communication = _b.sent();
                    response.setBody(communication);
                    return [3 /*break*/, 7];
                case 6:
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
                    return [3 /*break*/, 7];
                case 7:
                    callback(null, response);
                    return [2 /*return*/];
            }
        });
    });
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nTWVzc2FnZS5wcm90ZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3R1ZGlvL2xvZ01lc3NhZ2UucHJvdGVjdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLGtEQUE4RDtBQUs5RCxJQUFNLGNBQWMsR0FBRyxVQUFPLFFBQTRCOzs7UUFDbEQsVUFBVSxHQUFHLHlDQUF5QyxDQUFDO1FBRTNELElBQUk7WUFFSSxZQUFVLGFBQWEsQ0FBQztZQUM1QixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztnQkFDcEIsU0FBTyxHQUFHLFNBQU8sS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUNsRSxVQUFVLElBQUksd0NBQWdDLFNBQU8sK0pBQWdKLE9BQU8sQ0FBQyxNQUFNLHNFQUEwRCxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSx5RUFBNkQsT0FBTyxDQUFDLElBQUksb0JBQWlCLENBQUE7WUFDL1ksQ0FBQyxDQUFDLENBQUE7WUFFRixVQUFVLElBQUksT0FBTyxDQUFDO1NBRXpCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUE0QixHQUFHLENBQUUsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsc0JBQU8sVUFBVSxFQUFDOztLQUNyQixDQUFBO0FBRUQsSUFBTSxXQUFXLEdBQUcsVUFBTyxPQUFpQixFQUFFLFlBQXdDOzs7OztnQkFDOUUsUUFBUSxHQUFTLEVBQUUsQ0FBQzs7OztnQkFFVCxxQkFBTSxZQUFZO3lCQUN4QixRQUFRO3lCQUNSLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFBOztnQkFGekIsUUFBUSxHQUFHLFNBRWMsQ0FBQzs7OztnQkFFMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FB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