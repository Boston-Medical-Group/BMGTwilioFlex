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
exports.handler = void 0;
var openai_1 = __importDefault(require("openai"));
var handler = function (context, event, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var response, openai, run, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = new Twilio.Response();
                response.appendHeader("Access-Control-Allow-Origin", "*");
                response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
                response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
                response.appendHeader("Content-Type", "application/json");
                response.setStatusCode(200);
                openai = new openai_1.default({ apiKey: context.OPENAI_API_KEY });
                return [4 /*yield*/, openai.beta.threads.runs.retrieve(event.thread_id, event.run_id)];
            case 1:
                run = _a.sent();
                if (!run) {
                    console.log('RUN NOT FOUND');
                    response.setBody({
                        code: "NOT_FOUND"
                    });
                    callback(null, response);
                }
                if (run.status !== 'completed') {
                    console.log("RUN NOT COMPLETED YET: ".concat(run.status));
                    response.setBody({
                        code: "IN_PROGRESS"
                    });
                    callback(null, response);
                }
                return [4 /*yield*/, openai.beta.threads.messages.list(event.thread_id)
                        .then(function (messages) { return __awaiter(void 0, void 0, void 0, function () {
                        var runMessage;
                        return __generator(this, function (_a) {
                            runMessage = messages.getPaginatedItems().find(function (message) { return message.run_id === event.run_id; });
                            return [2 /*return*/, runMessage ? runMessage : null];
                        });
                    }); }).catch(function (error) { return null; })];
            case 2:
                message = _a.sent();
                if (message) {
                    if (message.content[0].type !== 'text') {
                        response.setBody({
                            code: "NOT_TEXT",
                            body: null
                        });
                        callback(null, response);
                    }
                    else {
                        response.setBody({
                            code: "SUCCESS",
                            body: message.content[0].text.value
                        });
                        callback(null, response);
                    }
                }
                else {
                    console.log('MESSAGE NOT FOUND');
                    response.setBody({
                        code: "NOT_FOUND"
                    });
                    callback(null, response);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZWFkUnVuU3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FpL3RocmVhZFJ1blN0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBMkI7QUFXcEIsSUFBTSxPQUFPLEdBQUcsVUFDbkIsT0FBMkIsRUFDM0IsS0FBYyxFQUNkLFFBQTRCOzs7OztnQkFJdEIsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRCxRQUFRLENBQUMsWUFBWSxDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQzFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ3RFLFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQzFELFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBRXJCLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBRW5CLHFCQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUE7O2dCQUEzRyxHQUFHLEdBQWtDLFNBQXNFO2dCQUVqSCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtvQkFDNUIsUUFBUSxDQUFDLE9BQU8sQ0FBQzt3QkFDYixJQUFJLEVBQUUsV0FBVztxQkFDcEIsQ0FBQyxDQUFBO29CQUNGLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0JBQzVCLENBQUM7Z0JBRUQsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRSxDQUFDO29CQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUEwQixHQUFHLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQTtvQkFDbkQsUUFBUSxDQUFDLE9BQU8sQ0FBQzt3QkFDYixJQUFJLEVBQUUsYUFBYTtxQkFDdEIsQ0FBQyxDQUFBO29CQUNGLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0JBQzVCLENBQUM7Z0JBRWUscUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO3lCQUNuRSxJQUFJLENBQUMsVUFBTyxRQUFROzs7NEJBQ1gsVUFBVSxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU8sSUFBSyxPQUFBLE9BQU8sQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLE1BQU0sRUFBL0IsQ0FBK0IsQ0FBQyxDQUFBOzRCQUNsRyxzQkFBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFBOzt5QkFDeEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsRUFBQTs7Z0JBSnZCLE9BQU8sR0FBRyxTQUlhO2dCQUU3QixJQUFJLE9BQU8sRUFBRSxDQUFDO29CQUNWLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFLENBQUM7d0JBQ3JDLFFBQVEsQ0FBQyxPQUFPLENBQUM7NEJBQ2IsSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLElBQUksRUFBRSxJQUFJO3lCQUNiLENBQUMsQ0FBQTt3QkFDRixRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO29CQUM1QixDQUFDO3lCQUFNLENBQUM7d0JBQ0osUUFBUSxDQUFDLE9BQU8sQ0FBQzs0QkFDYixJQUFJLEVBQUUsU0FBUzs0QkFDZixJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSzt5QkFDdEMsQ0FBQyxDQUFBO3dCQUNGLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7b0JBQzVCLENBQUM7Z0JBQ0wsQ0FBQztxQkFBTSxDQUFDO29CQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtvQkFDaEMsUUFBUSxDQUFDLE9BQU8sQ0FBQzt3QkFDYixJQUFJLEVBQUUsV0FBVztxQkFDcEIsQ0FBQyxDQUFBO29CQUNGLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0JBQzVCLENBQUM7Ozs7S0FFSixDQUFBO0FBOURZLFFBQUEsT0FBTyxXQThEbkIifQ==