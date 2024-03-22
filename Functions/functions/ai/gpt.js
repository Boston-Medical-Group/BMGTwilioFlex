"use strict";
// This code should be used in a Twilio Function https://console.twilio.com/us1/develop/functions/services to create a service
// Copy and Paste the below to a new twilio function under a serivce that you created 
//in deps add Module openai-	Version	3.2.1	
//also twilio-flex-token-validator version latest
// under enviromental variables add API_KEY and use your openaikey get it from here https://platform.openai.com/account/api-keys
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var openai_1 = __importDefault(require("openai"));
//under enviromental variables add you could also add the model under API_MODEL , if not it will default to gpt3.5 turbo.
var TokenValidator = require('twilio-flex-token-validator').functionValidator;
exports.handler = TokenValidator(function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var response, spokenInput, requestType, API_KEY, API_MODEL, openai, prompt, history, historyDelivered, messages, response_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = new Twilio.Response();
                response.appendHeader('Access-Control-Allow-Origin', '*');
                response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
                response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
                spokenInput = event.input;
                requestType = event.requestType;
                API_KEY = context.OPENAI_GPT_API_KEY;
                API_MODEL = context.API_MODEL;
                openai = new openai_1.default({
                    apiKey: API_KEY,
                });
                prompt = spokenInput;
                return [4 /*yield*/, context.getTwilioClient().conversations.v1.conversations(event.input).messages.list()];
            case 1:
                history = _a.sent();
                historyDelivered = history.filter(function (h) { var _a; return h.delivery === null || ((_a = h.delivery) === null || _a === void 0 ? void 0 : _a.delivered) === 'all'; });
                messages = [];
                // System messages
                messages.push({
                    role: 'system',
                    content: 'Eres el asistente de resúmenes de conversaciones de Boston Medical, la clínica de salud sexual masculina.'
                });
                messages.push({
                    role: 'system',
                    content: 'La conversación se produce entre nuestro agente y un paciente por Whatsapp.'
                });
                historyDelivered.forEach(function (h) {
                    var author = 'assistant';
                    if (h.author.startsWith('whatsapp:')) {
                        author = 'user';
                    }
                    messages.push({
                        role: author,
                        content: h.body
                    });
                });
                if (requestType === "summary") {
                    messages.push({
                        role: 'assistant',
                        content: 'Crea un resumen de la conversación en máximo 500 caracteres. No incluyas las fechas. De tener el dato, menciona la ciudad desde la que nos contacta y la clínica a la cuál quiere asistir'
                    });
                }
                if (requestType === "suggest") {
                    messages.push({
                        role: 'assistant',
                        content: 'Ofrece una sugerencia acerca de como continuar la conversación, responde sólo con el mensaje sugerido'
                    });
                }
                if (requestType === "sentiment") {
                    messages.push({
                        role: 'assistant',
                        content: 'Evalúa el sentimiento del paciente con respecto a su intención de agendar una cita en una escala del 1 al 100 y responde sólo con el número'
                    });
                }
                if (!API_MODEL) {
                    openai.chat.completions.create({
                        model: "gpt-3.5-turbo-0125",
                        messages: messages,
                    })
                        .then(function (completion) {
                        // Extracting the summary from the OpenAI API response
                        var reply = completion.choices[0].message.content;
                        response.appendHeader('Content-Type', 'application/json');
                        response.setBody({ reply: reply });
                        callback(null, response);
                    })
                        .catch(function (error) {
                        response.appendHeader('Content-Type', 'plain/text');
                        response.setBody(error.message);
                        response.setStatusCode(500);
                        callback(null, response);
                    });
                }
                else {
                    response_1 = new Twilio.Response();
                    response_1.appendHeader('Content-Type', 'plain/text');
                    response_1.setBody('Invalid model parameter only gpt and text models supported');
                    response_1.setStatusCode(400);
                    return [2 /*return*/, callback(null, response_1)];
                }
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3B0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FpL2dwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEhBQThIO0FBQzlILHNGQUFzRjtBQUN0RiwyQ0FBMkM7QUFDM0MsaURBQWlEO0FBQ2pELGdJQUFnSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHaEksa0RBQTRCO0FBRzVCLHlIQUF5SDtBQUN6SCxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztBQWFoRixPQUFPLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyxVQUM3QixPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7O2dCQUd0QixRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZDLFFBQVEsQ0FBQyxZQUFZLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzFELFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDMUUsUUFBUSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFJaEUsV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBRTFCLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO2dCQUdoQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO2dCQUNyQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFFOUIsTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQztvQkFDdEIsTUFBTSxFQUFFLE9BQU87aUJBQ2xCLENBQUMsQ0FBQztnQkFHQyxNQUFNLEdBQUcsV0FBVyxDQUFDO2dCQUVULHFCQUFNLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENB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