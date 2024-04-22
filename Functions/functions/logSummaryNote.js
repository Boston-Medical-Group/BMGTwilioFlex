const FunctionTokenValidator = require('twilio-flex-token-validator').functionValidator;
const fetch = require("node-fetch");
const OpenAI = require("openai");
const { getGPTSummary } = require(Runtime.getFunctions()['helpers/crmHelper'].path);

const createSummary = async (historyDelivered, context) => {
  if (historyDelivered.length <= 3) {
    return false
  }

  const API_KEY = context.OPENAI_GPT_API_KEY;
  const apiModel = context.API_MODEL;

  const openai = new OpenAI({
    apiKey: API_KEY,
  });

  return await getGPTSummary(openai, historyDelivered, apiModel)
}

/**
 * @typedef {import('twilio').Twilio} TwilioClient
 */

const getMessages = async (twilioClient, conversationSid) => {
  let messages = [];
  try {
    messages = await twilioClient.conversations.v1.conversations(conversationSid)
      .messages
      .list({ limit: 500 });
  } catch (err) {
    console.error(`Oops, something is wrong ${err}`);
  }

  return messages;
}

const hasEnoughMessages = (messages) => {
  let historyDelivered = messages.filter((h) => h.delivery === null && h.author.startsWith('whatsapp:'))

  if (historyDelivered.length > 0) {
    return true
  }
  
  return false
}

const getParseConversationForAI = async (messages) => {
  /** @type array */
  let historyDelivered = messages.filter((h) => h.delivery === null || h.delivery?.delivered === 'all')
  let messagesParsed = [];

  // TODO Si el contacto no ha respondido. Guardar una nota generica y no usar GPT
  
  historyDelivered.forEach((h) => {
    let author = 'Agente'
    if (h.author.startsWith('whatsapp:')) {
      author = 'Paciente'
    }
    messagesParsed.push(`${h.dateCreated} @ ${author} : ${h.body}`)
  })

  return messagesParsed
}

// @ts-ignore
exports.handler = FunctionTokenValidator(async function (  context,  event,  callback) {

  const {
    conversationSid,
    hs_timestamp,
    hubspot_contact_id,
    hubspot_deal_id,
    hubspot_owner_id
  } = event

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  if (!hubspot_contact_id) {
    console.log('CRMID Inválido');
    response.setBody({ error: 'hubspot_contact_id Inválido al crear resumen' });
    response.setStatusCode(404);
    callback(null, response);
    return
  }

  
  let summaryContent;
  try {
    const conversationContext = context.getTwilioClient().conversations.v1.conversations(conversationSid)
    const history = await conversationContext.messages.list()

    let historyDelivered = history.filter((h) => h.delivery === null || h.delivery?.delivered === 'all')

    let clientMessages = historyDelivered.filter((m) => m.author.startsWith('whatsapp:'))
    let agentMessages = historyDelivered.filter((m) => !m.author.startsWith('whatsapp:'))
    if (clientMessages.length === 0 && agentMessages.length > 0) {
      summaryContent = 'Se ha contactado al paciente, pero aún no se obtuvo una respuesta'
    } else if (historyDelivered.length < 4) {
      response.setBody({ result: 'TOO_SHORT' });
      return callback(null, response);
      //summaryContent = 'Aún no se ha generado resumen ya que la conversación es muy breve'

    } else {
      summaryContent = await createSummary(historyDelivered, context)
    }
  } catch (err) {
    console.log(err)
    response.setBody({ error: err });
    return callback(null, response);
  }

  let hs_note_body = 'Resumen AI: ' + summaryContent;

  let toHubspot = {
    properties: {
      hs_timestamp,
      hs_note_body,
      hubspot_owner_id
    },
    associations: [
      {
        to: {
          id: hubspot_contact_id
        },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 202
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
          associationTypeId: 214
        }
      ]
    })
  }

  try {
    const request = await fetch(`https://api.hubapi.com/crm/v3/objects/notes`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.HUBSPOT_TOKEN}`
      },
      body: JSON.stringify(toHubspot)
    });
    
    if (!request.ok) {
      console.log(err)
      throw new Error('Error while retrieving data from hubspot');
    } else {
      const data = await request.json();

      response.setBody(data);
    }
  } catch (err) {
    console.log(err)
    response.setBody({ error: err });
  }

  return callback(null, response);
})
