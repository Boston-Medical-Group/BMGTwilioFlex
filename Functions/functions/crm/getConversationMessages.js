const OpenAI = require("openai");
const { getGPTSummary } = require(Runtime.getFunctions()['helpers/crmHelper'].path);
const fetch = require("node-fetch");

//under enviromental variables add you could also add the model under API_MODEL , if not it will default to gpt3.5 turbo.
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const MAX_CONVERSATIONS_TO_FETCH = 5;

const createSummary = async (historyDelivered, context) => {
    if (historyDelivered.length <= 3) {
        return false
    }

    const API_KEY = context.OPENAI_GPT_SUMMARY_APIKEY;
    const apiModel = context.API_MODEL;

    const openai = new OpenAI({
        apiKey: API_KEY,
    });

    return await getGPTSummary(openai, historyDelivered, apiModel)
}

async function getConversationMessages(context, conversationSid) {
    //fetch conversations with filters
    const conversationContext = context.getTwilioClient().conversations.v1.conversations(conversationSid)
    const conversation = await conversationContext.fetch()
    const history = await conversationContext.messages.list()

    try {
        let conversationAttributes = JSON.parse(conversation.attributes)

        let historyDelivered = history.filter((h) => h.delivery === null || h.delivery?.delivered === 'all')
        let summaryContent;
        // Si la conversación no tiene resumen, generamos uno.
        if (!conversationAttributes.chatgpt_summary_content) {
            summaryContent = await createSummary(historyDelivered, context)
            if (summaryContent) {
                summaryTimestamp = new Date().toISOString()
                conversationAttributes.chatgpt_summary_content = summaryContent
                conversationAttributes.chatgpt_summary_timestamp = summaryTimestamp
                conversationAttributes.chatgpt_summary_messages_counter = historyDelivered.length
                await conversation.update({
                    attributes: JSON.stringify(conversationAttributes)
                })
            }
        } else {
            summaryContent = conversationAttributes.chatgpt_summary_content
        }

        return {
            log: history,
            summary: summaryContent
        }
    } catch (error) {
        return {
            error: err
        };
    }
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

    //validate if a number has been provided
    if (!conversationSid) {
        response.setBody({error: "no conversationSid provided"});
        response.setStatusCode(200);
        callback(null, response);
        return
    }

    await getConversationMessages(context, conversationSid)
        .then(async (resp) => {
            // handle success 
            var data = resp;
            if (typeof data !== 'undefined') {
                response.setBody(data);
            }
            //handle error
            else response.setBody({result: "error"});
            response.setStatusCode(200);
        })
        .catch(function (err) {
            response.setBody({ error: err });
            response.setStatusCode(200);
        })
    
    callback(null, response);

})