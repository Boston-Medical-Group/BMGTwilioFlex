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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var twilio_flex_token_validator_1 = require("twilio-flex-token-validator");
var iso2ToCountry = require(Runtime.getFunctions()['helpers/utils'].path).iso2ToCountry;
var replaceTemplate = require(Runtime.getFunctions()['helpers/template-replacer'].path).replaceTemplate;
var node_fetch_1 = __importDefault(require("node-fetch"));
//@ts-ignore
exports.handler = (0, twilio_flex_token_validator_1.functionValidator)(function (context, event, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultCountry, countryCode, templates, response, err_1, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    defaultCountry = context.COUNTRY === 'dev' ? 'DEV' : context.COUNTRY.substring(0, 2).toUpperCase();
                    if (defaultCountry === 'ME') {
                        defaultCountry = 'MX';
                    }
                    else if (defaultCountry === 'AL' || defaultCountry === 'ALE') {
                        defaultCountry = 'DE';
                    }
                    countryCode = iso2ToCountry(defaultCountry);
                    return [4 /*yield*/, getTemplatesFromManager(countryCode, context, event.data)];
                case 1:
                    templates = _a.sent();
                    response = new Twilio.Response();
                    response.appendHeader("Access-Control-Allow-Origin", "*");
                    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                    response.appendHeader("Content-Type", "application/json");
                    response.setBody(templates);
                    // Return a success response using the callback function.
                    callback(null, response);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        response = new Twilio.Response();
                        response.appendHeader("Access-Control-Allow-Origin", "*");
                        response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                        response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
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
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
var getTemplatesFromManager = function (countryCode, context, parameters) {
    return __awaiter(this, void 0, void 0, function () {
        var result, templates, i, element, templateMessage;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(context.FLEXMANAGER_API_URL, "//messaging-templates?filter[country]=").concat(countryCode, "&filter[message_type]=whatsapp"), {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/vnd.api+json',
                                'Authorization': "Bearer ".concat(context.FLEXMANAGER_API_KEY)
                            }
                        })
                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, res.json()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })];
                case 1:
                    result = _a.sent();
                    templates = [];
                    if (result.data && result.data.length > 0) {
                        // loop object
                        for (i = 0; i < result.data.length; i++) {
                            element = result.data[i];
                            templateMessage = replaceTemplateVariables(element.attributes.message.replaceAll('\\n', '\n'), parameters);
                            // convert \n to line breaks on element
                            templates.push({
                                name: element.attributes.template_name,
                                message: templateMessage
                            });
                        }
                    }
                    return [2 /*return*/, templates];
            }
        });
    });
};
/**
 * Replaces template variables in a message with corresponding values from parameters.
 */
var replaceTemplateVariables = function (message, parameters) {
    var extractedParameters = extractTemplateParameters(message);
    var replacedMessage = message;
    extractedParameters.forEach(function (parameter) {
        var paremeterValue = data_get(parameters, parameter, false);
        if (paremeterValue) {
            replacedMessage = replacedMessage.replaceAll("{{".concat(parameter, "}}"), paremeterValue);
        }
    });
    for (var _i = 0, _a = Object.entries(parameters); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        replacedMessage = replacedMessage.replaceAll("{{".concat(key, "}}"), value);
    }
    return replacedMessage;
};
/**
 * Extracts template parameters from a given message.
 */
var extractTemplateParameters = function (message) {
    var extractedParameters = [];
    var regex = /{{(.*?)}}/g;
    var match;
    while ((match = regex.exec(message)) !== null) {
        extractedParameters.push(match[1]);
    }
    return Array.from(new Set(extractedParameters));
};
/**
 * Retrieves a value from an object using a key or a nested key path.
 *
 * @param {Object} obj - The object to retrieve the value from.
 * @param {string|array} key - The key or nested key path to retrieve the value from the object.
 * @param {any} default_value - The default value to return if the key or key path is not found in the object.
 * @return {any} The value associated with the key or key path in the object, or the default value if not found.
 */
var data_get = function (obj, key, default_value) {
    if (typeof key === 'string') {
        key = key.split('.');
    }
    for (var i = 0; i < key.length; i++) {
        if (obj === null || typeof obj !== 'object') {
            return default_value;
        }
        obj = obj[key[i]];
    }
    return obj || default_value;
};
/*
const getTemplatesFromFiles = async function (
  defaultCountry: string,
  context: Context<MyContext>,
  event: MyEvent
) {
  const {
    hubspot_id,
    deal_id,
    Token
  } = event;

  const templatesFileName = `templates_${defaultCountry}.json`;
  let template;
  try {
    const openTemplateFile = Runtime.getAssets()[`/templates/${templatesFileName}`].open;
    const templateRaw = JSON.parse(openTemplateFile());

    const client = context.getTwilioClient();

    // todo obtener datos del deal o cita (futuro?) y formatear de una manera que la plantilla entienda
    if (hubspot_id && templateRaw?.length > 0) {
      const request = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${hubspot_id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context.HUBSPOT_TOKEN}`
        }
      });

      if (!request.ok) {
        throw new Error('Error while retrieving data from hubspot');
      }

      const contactInformation = await request.json();
      const tokenInformation = await TokenValidator(Token, context.ACCOUNT_SID || '', context.AUTH_TOKEN || '');
      const workerInformation = await client.conversations.v1.users(tokenInformation.identity).fetch();

      template = templateRaw.map(item => {

        let formattedItem = item.replace(/{{customerFirstName}}/, contactInformation.properties.firstname);
        formattedItem = formattedItem.replace(/{{customerLastName}}/, contactInformation.properties.lastname);
        formattedItem = formattedItem.replace(/{{agentName}}/, workerInformation.friendlyName);

        return formattedItem;
      });
    } else {
      template = templateRaw;
    }
  } catch (err) {
    template = [];
  }

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  response.appendHeader("Content-Type", "application/json");
  response.setBody(template);
  // Return a success response using the callback function.
  callback(null, response);
}
*/ 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2hUZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mZXRjaFRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMkVBQXNIO0FBQzlHLElBQUEsYUFBYSxHQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQTFELENBQTJEO0FBQ3hFLElBQUEsZUFBZSxHQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQXRFLENBQXVFO0FBQzlGLDBEQUErQjtBQW9CL0IsWUFBWTtBQUNaLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBQSwrQ0FBc0IsRUFBQyxVQUN2QyxPQUEyQixFQUMzQixLQUFjLEVBQ2QsUUFBNEI7Ozs7Ozs7b0JBSXRCLGNBQWMsR0FBWSxPQUFPLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBRWhILElBQUksY0FBYyxLQUFLLElBQUksRUFBRSxDQUFDO3dCQUM1QixjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUN4QixDQUFDO3lCQUFNLElBQUksY0FBYyxLQUFLLElBQUksSUFBSSxjQUFjLEtBQUssS0FBSyxFQUFFLENBQUM7d0JBQy9ELGNBQWMsR0FBRyxJQUFJLENBQUM7b0JBQ3hCLENBQUM7b0JBRUssV0FBVyxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFFaEMscUJBQU0sdUJBQXVCLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUE7O29CQUEz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