import { functionValidator as FunctionTokenValidator } from 'twilio-flex-token-validator';
import { Client as HubspotClient } from '@hubspot/api-client'
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { SimplePublicObjectWithAssociations as ContactSimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { SimplePublicObjectWithAssociations as DealSimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/deals';

type MyContext = {
  HUBSPOT_TOKEN: string
}

const fetchByContact = async (contact_id: string, context: Context<MyContext>, deal?: DealSimplePublicObjectWithAssociations) => {
  const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
  const contact: ContactSimplePublicObjectWithAssociations = await hubspotClient.crm.contacts.basicApi.getById(
    contact_id,
    [
      'email',
      'firstname',
      'lastname',
      'phone',
      'hs_object_id',
      'reservar_cita',
      'country',
      'donotcall',
      'numero_de_telefono_adicional',
      'numero_de_telefono_adicional_',
      'whatsappoptout'
    ],
  )
    .then((hubpostContact: ContactSimplePublicObjectWithAssociations) => hubpostContact)
    .catch((error) => {
      throw new Error('Error while retrieving data from hubspot (CONTACT)');
    })
  
  return {
    ...contact,
    deal: deal ?? null
  }
}

const fetchByDeal = async (deal_id: string, context: Context<MyContext>) => {
  const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
  const deal: DealSimplePublicObjectWithAssociations = await hubspotClient.crm.deals.basicApi.getById(
    deal_id,
    ['dealname', 'dealstage', 'hs_object_id', 'reservar_cita'],
    [],
    ['contact']
  ).then((hubspotDeal: DealSimplePublicObjectWithAssociations) => hubspotDeal)
  .catch((error) => {
    throw new Error('Error while retrieving data from hubspot (DEAL)');
  })

  const contacts = deal.associations?.contacts ? deal.associations.contacts.results : [];

  if (contacts.length > 0) {
    const contactAssociation = contacts[0];
    return await fetchByContact(contactAssociation.id, context, deal);
  } else {
    throw new Error('Error while retrieving data from hubspot (DEALCONTACT)');
  }
}

type MyEvent = {
  contact_id?: string
  deal_id?: string
}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {
  const {
    contact_id,
    deal_id
  } = event;

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    let data;
    if (contact_id) {
      data = await fetchByContact(contact_id, context);
    } else if (deal_id) {
      data = await fetchByDeal(deal_id, context);
    } else {
      throw new Error('CONTACT ID (contact_id) o DEAL ID Inválidos');
    }
    
    response.appendHeader("Content-Type", "application/json");
    response.setBody(data);
    // Return a success response using the callback function.
    callback(null, response);


  } catch (err) {

    if (err instanceof Error) {
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
