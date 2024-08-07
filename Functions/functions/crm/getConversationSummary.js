const OpenAI = require("openai");
const { getGPTSummary } = require(Runtime.getFunctions()['helpers/crmHelper'].path);

//under enviromental variables add you could also add the model under API_MODEL , if not it will default to gpt3.5 turbo.
const TokenValidator = require('twilio-flex-token-validator').functionValidator;


const createSummary = async (historyDelivered, context, accountCountry) => {
    if (historyDelivered.length <= 3) {
        return false
    }

    const API_KEY = context.OPENAI_GPT_SUMMARY_APIKEY;
    const apiModel = context.API_MODEL;

    const openai = new OpenAI({
        apiKey: API_KEY,
    });

    return await getGPTSummary(openai, historyDelivered, apiModel, accountCountry)
}

exports.handler = TokenValidator(async (context, event, callback) => {
    //Set CORS headers (for HTTP call Flex --> Function)
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    const conversationSid = event.conversationSid
    let forceSummary = event.force ?? false
    const accountCountry = event.accountCountry ?? 'esp'

    const conversationContext = context.getTwilioClient().conversations.v1.conversations(conversationSid)
    const conversation = await conversationContext.fetch()
    const history = await conversationContext.messages.list()
    let historyDelivered = history.filter((h) => h.delivery === null || h.delivery?.delivered === 'all')
    try {
        let conversationAttributes = JSON.parse(conversation.attributes)

        let summaryContent;
        let summaryTimestamp;

        let clientMessages = historyDelivered.filter((m) => m.author.startsWith('whatsapp:'))
        let agentMessages = historyDelivered.filter((m) => !m.author.startsWith('whatsapp:'))
        if (clientMessages.length === 0 && agentMessages.length > 0) {
            summaryContent = accountCountry === 'bra' ? 'O paciente foi contatado, mas ainda não recebeu resposta.' : 'Se ha contactado al paciente, pero aún no se obtuvo una respuesta'
        } else if (historyDelivered.length < 4) {
            summaryContent = accountCountry === 'bra' ? 'Nenhum resumo foi gerado ainda, pois a conversa foi muito breve.' : 'Aún no se ha generado resumen ya que la conversación es muy breve'
        } else {
            // Si la conversación se ha actualizado o ha pasado mucho tiempo, forzamos un nuevo resument
            const oldCounter = conversationAttributes.chatgpt_summary_messages_counter ?? historyDelivered.length
            if (oldCounter < historyDelivered.length) {
                forceSummary = true
            }
            // Compare now with a ISOString date and check if there has been more than 10 minutes
            if (conversationAttributes.chatgpt_summary_timestamp) {
                const diff = new Date() - new Date(conversationAttributes.chatgpt_summary_timestamp);
                if (diff > 10 * 60 * 1000) {
                    forceSummary = true
                }
            }

            if (!conversationAttributes.chatgpt_summary_content || forceSummary) {
                summaryContent = await createSummary(historyDelivered, context, accountCountry)
                if (summaryContent) {
                    summaryTimestamp = new Date().toISOString()
                    conversationAttributes.chatgpt_summary_content = summaryContent
                    conversationAttributes.chatgpt_summary_timestamp = summaryTimestamp
                    conversationAttributes.chatgpt_summary_messages_counter = historyDelivered.length
                    await conversation.update({
                        attributes: JSON.stringify(conversationAttributes)
                    })
                }
            } else if (conversationAttributes.chatgpt_summary_content) {
                summaryContent = conversationAttributes.chatgpt_summary_content
            }
        }

        if (summaryContent != '') {
            response.setBody({ content: summaryContent, messagesCount: historyDelivered.length })
        } else {
            response.setBody({})
        }
    } catch (error) {
        response.setBody({});
    }

    callback(null, response);
});

