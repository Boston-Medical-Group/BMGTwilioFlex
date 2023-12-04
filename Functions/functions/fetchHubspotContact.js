const FunctionTokenValidator = require('twilio-flex-token-validator').functionValidator;
const fetch = require("node-fetch");

const fetchByContact = async (crmid, context, deal) => {
  const request = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${crmid}/?properties=email,firstname,lastname,phone,hs_object_id,reservar_cita`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.HUBSPOT_TOKEN}`
    }
  });

  if (!request.ok) {
    throw new Error('Error while retrieving data from hubspot');
  }

  const contact = await request.json();
  return {
    ...contact,
    deal: deal ?? null
  }
}

const fetchByDeal = async (deal_id, context) => {
  const request = await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${deal_id}/?associations=contacts`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.HUBSPOT_TOKEN}`
    }
  });

  if (!request.ok) {
    throw new Error('Error while retrieving data from hubspot');
  }

  const deal = await request.json();
  if (deal.associations?.contacts?.results?.length > 0) {
    const contactId = deal.associations.contacts.results[0].id;
    return await fetchByContact(contactId, context, deal);
  } else {
    throw new Error('Error while retrieving data from hubspot');
  }
}

exports.handler = FunctionTokenValidator(async function (  context, event, callback) {
  const {
    crmid,
    deal_id
  } = event;

  try {
    let data;
    if (crmid) {
      data = await fetchByContact(crmid, context);
    } else if (deal_id) {
      data = await fetchByDeal(deal_id, context);
    } else {
      throw new Error('CONTACT ID (crmid) o DEAL ID Inválidos');
    }
    
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
