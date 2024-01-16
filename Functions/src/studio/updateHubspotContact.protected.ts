import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObject, CollectionResponseWithTotalSimplePublicObjectForwardPaging } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';

/** Receives a phone number, queries HUBSPOT and returns the customer record.
* If the CRM has a duplicate number, the function returns the first record (usually the oldest)
*/

type MyContext = {
  COUNTRY: string
  HUBSPOT_TOKEN: string
}

type MyEvent = {
  from: string
  to: string
  crmid: string
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
  let to   = event.to;

  //if the string from contains a whatsapp prefix we need to remove it
  from = from.replace('whatsapp:', '');
  to = to.replace('whatsapp:', '');
  
  const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
  await hubspotClient.crm.contacts.basicApi.update(event.crmid, {
    properties: {
      tf_inbound_ddi: to.replace(/\s/g, ""),
      tf_inbound_date: `${(new Date).getTime()}`,
    }
  }).then(function (contact : SimplePublicObject) {
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

