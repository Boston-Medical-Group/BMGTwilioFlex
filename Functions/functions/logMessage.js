const FunctionTokenValidator = require('twilio-flex-token-validator').functionValidator;
const fetch = require("node-fetch");

/**
 * @typedef {import('twilio').Twilio} TwilioClient
 */

/**
 * 
 * @param {TwilioClient} twilioClient 
 * @param {string} conversationSid 
 * @returns 
 */
const getHtmlMessage = async (messages) => {
  let resultHtml = '<ul style="list-style:none;padding:0;">';

  try {

    let bgColor = 'transparent';
    messages.forEach(message => {
      bgColor = bgColor === 'transparent' ? '#0091ae12' : 'transparent'; 
      resultHtml += `<li style="background-color: ${bgColor};border: 1px solid #cfdae1;padding: 5px;margin-bottom: 4px;"><div style="color: #5d7185;font-weight: bold;margin-bottom:5px;"><span class="">${message.author}</span> - <span style="color: #738ba3;font-size: 9px;">${message.dateCreated.toLocaleString()}</span></div><div style="padding: 6px;color: #333f4d;"><p>${message.body}</p></div></li>`
    })

    resultHtml += '</ul>';

  } catch (err) {
    console.error(`Oeps, something is wrong ${err}`);
  }

  return resultHtml;
}

const getMessages = async (twilioClient, conversationSid) => {
  let messages = [];
  try {
    messages = await twilioClient.conversations.v1.conversations(conversationSid)
      .messages
      .list({ limit: 500 });
  } catch (err) {
    console.error(`Oeps, something is wrong ${err}`);
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
      author = 'Cliente'
    }
    messagesParsed.push(`${h.dateCreated} @ ${author} : ${h.body}`)
  })

  return messagesParsed
}

// @ts-ignore
exports.handler = FunctionTokenValidator(async function (  context,  event,  callback) {

  const {
    conversationSid,
    hubspot_contact_id,
    hubspot_deal_id,
    hs_communication_channel_type,
    hs_communication_logged_from,
    hs_communication_body,
    hs_timestamp,
    hubspot_owner_id
  } = event

  try {
    if (!hubspot_contact_id) {
      throw new Error('CRMID Inválido');
    }

    let logBody = hs_communication_body;
    logBody += '<br /><br />';
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

    let prompt = `escribe un corto resumen , max 7 lineas del siguiente historial de conversación, no incluyas las fechas en las respuestas: ${parsedConversationForAI.concat('\n\n')}`;
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

    if (summary !== '') {
      logBody += 'Resumen AI: ' + summary.choices[0].message.content;
      logBody += '<br /><br />';
    }
    logBody += await getHtmlMessage(conversationMessages);

    let toHubspot = {
      properties: {
        hs_communication_channel_type,
        hs_communication_logged_from,
        hs_communication_body: logBody,
        hs_timestamp,
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
      })
    }

    const request = await fetch(`https://api.hubapi.com/crm/v3/objects/communications`, {
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

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    response.setBody(data);
    // Return a success response using the callback function.
    callback(null, response);


  } catch (err) {

    if (err instanceof Error) {
      const response = new Twilio.Response();
      response.appendHeader("Access-Control-Allow-Origin", "*");
      response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
      response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

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
