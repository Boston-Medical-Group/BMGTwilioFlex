import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';

/** Receives a phone number, queries HUBSPOT and returns the customer record.
* If the CRM has a duplicate number, the function returns the first record (usually the oldest)
*/

const countryMap : { [key: string]: string } = {
  ecu: 'EC',
  can: 'CA',
  mex: 'MX',
  col: 'CO',
  arg: 'AR',
  esp: 'ES',
  spa: 'ES',
  per: 'PE',
  ale: 'DE',
  deu: 'DE',
  bra: 'BR',
  dev: 'ES',
};

type MyEvent = {
  from: string;
  to: string;
}

type MyContext = {
  HUBSPOT_TOKEN: string;
  COUNTRY: string;
}

exports.handler = async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {
  let result = {
    crmid: '',
    firstname: '',
    lastname: '',
    fullname: '',
    lifecyclestage: ''
  };
  let from = event.from;
  let to = event.to;

  //if the string from contains a whatsapp prefix we need to remove it
  from = from.replace('whatsapp:', '');
  to = to.replace('whatsapp:', '');

  const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })

  await hubspotClient.crm.contacts.basicApi.create({
    properties: {
      firstname: 'Anonymous',
      lastname: 'Contact',
      phone: from,
      hs_lead_status: 'NEW',
      tipo_de_lead: 'Llamada',
      country: countryMap[context.COUNTRY],
      tf_inbound_ddi: to.replace(/\s/g, ""),
      tf_inbound_date: `${(new Date()).getTime()}`
    },
    associations: []
  }).then(function (contact : SimplePublicObject) {
    console.log(contact)
    //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
    result.crmid = `${contact.id}`; //required for screenpop
    result.firstname = `${contact.properties.firstname}`;
    result.lastname = `${contact.properties.lastname}`;
    result.fullname = `${contact.properties.firstname ?? ''} ${contact.properties.lastname ?? ''}`;
    result.lifecyclestage = `${contact.properties?.lifecyclestage ?? 'lead'}`;
    if (result.fullname.trim() == '') {
      result.fullname = 'Customer'
    }

    callback(null, result);
  })
    .catch(function (error) {
      // handle error
      console.log(`Error: ${error}`);
      callback(null, error);
    });
};

