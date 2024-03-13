const FunctionTokenValidator = require('twilio-flex-token-validator').functionValidator;
const fetch = require("node-fetch");

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

const getParseConversationForAI = async (messages) => {
  /** @type array */
  let historyDelivered = messages.filter((h) => h.delivery === null || h.delivery?.delivered === 'all')
  let messagesParsed = [];
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

  try {
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    if (!hubspot_contact_id) {
      console.log('CRMID Inválido');
      response.appendHeader("Content-Type", "application/json");
      response.setStatusCode(404);
      callback(null, response);
    }

    //Obtiene mensajes de la conversación y genera log
    const conversationMessages = await getMessages(context.getTwilioClient(), conversationSid);
    const parsedConversationForAI = await getParseConversationForAI(conversationMessages)

    // Importing required modules
    const OpenAI = require("openai");

    // Getting the API key from Twilio environment variables
    const API_KEY = context.OPENAI_GPT_API_KEY;
    const API_MODEL = context.API_MODEL;

    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    let prompt = `Escribe un resumen de un máximo de 500 caracteres del siguiente historial de conversación. No incluyas las fechas en las respuestas. Has referencia al cliente como "paciente". De tener el dato, menciona la ciudad desde la que nos contacta y la clínica a la cuál quiere asistir: ${parsedConversationForAI.concat('\n\n')}`;
    let summary = '';
    if (!API_MODEL) {
      //const summary = completion.choices[0].message.content;
      summary = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      })
    } else if (API_MODEL.startsWith('gpt-')) {
      summary = openai.chat.completions.create(({
        model: API_MODEL,
        messages: [{ role: "user", content: prompt }],
      }))
    } else {
      summary = ''
    }

    let hs_note_body = 'Resumen AI: ' + summary.choices[0].message.content;

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

    const request = await fetch(`https://api.hubapi.com/crm/v3/objects/notes`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.HUBSPOT_TOKEN}`
      },
      body: JSON.stringify(toHubspot)
    });

    if (!request.ok) {
      throw new Error('Error while retrieving data from hubspot');
    }

    const data = await request.json();

    response.appendHeader("Content-Type", "application/json");
    response.setBody(data);
    // Return a success response using the callback function.
    callback(null, response);

  } catch (err) {

    if (err instanceof Error) {
      const response = new Twilio.Response();
      response.appendHeader("Content-Type", "plain/text");
      response.setBody(err.message);
      response.setStatusCode(500);
      // If there's an error, send an error response
      // Keep using the response object for CORS purposes
      console.error(err);
      callback(null, response);
    } else {
      callback(null, {});
    }

  }
})
