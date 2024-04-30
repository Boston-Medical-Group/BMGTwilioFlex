const OpenAI = require("openai");
const { getGPTThreadRun } = require(Runtime.getFunctions()['helpers/crmHelper'].path);
const fetch = require("node-fetch");

//under enviromental variables add you could also add the model under API_MODEL , if not it will default to gpt3.5 turbo.
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const MAX_CONVERSATIONS_TO_FETCH = 5;

const createThreadAndRun = async (historyDelivered, instructions, context) => {
    if (historyDelivered.length == 0) {
        return false
    }

    const API_KEY = context.OPENAI_GPT_ASSISTANT_APIKEY;
    const ASSISTANT = context.OPENAI_ASSISTANT_ID;

    const openai = new OpenAI({
        apiKey: API_KEY,
    });

    return await getGPTThreadRun(openai, historyDelivered, instructions, ASSISTANT)
}

async function getConversationMessages(context, conversationSid) {
    //fetch conversations with filters
    const conversationContext = context.getTwilioClient().conversations.v1.conversations(conversationSid)
    const history = await conversationContext.messages.list()
    let historyDelivered = []

    try {
        historyDelivered = history.filter((h) => h.delivery === null || h.delivery?.delivered === 'all')
    } catch (error) {
        console.log(error)
    }

    return historyDelivered
}

exports.handler = TokenValidator(async (context, event, callback) => {
    //Set CORS headers (for HTTP call Flex --> Function)
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    // Necesito obtener las conversaciones del contacto (SMS o Whatsapp)
    const conversationSid = event.conversationSid ?? false
    const instructions    = event.instruction ?? ''

    //validate if a number has been provided
    if (!conversationSid) {
        response.setBody({ error: "no conversationSid provided" });
        response.setStatusCode(200);
        callback(null, response);
        return
    }

    await getConversationMessages(context, conversationSid)
        .then(async (resp) => {
            // handle success 
            await createThreadAndRun(resp, instructions, context)
                .then(async (data) => {
                    if (!data) {
                        response.setBody({ error: 'La conversación es muy corta para generar una sugerencia' })
                    } else {
                        response.setBody(data)
                    }
                    response.setStatusCode(200);
                }).catch((err) => {
                    response.setBody({ error: err })
                    response.setStatusCode(200);
                })
        })
        .catch(function (err) {
            response.setBody({ error: err });
            response.setStatusCode(200);
        })

    callback(null, response);

})