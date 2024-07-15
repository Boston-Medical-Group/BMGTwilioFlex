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
  leadtype?: string
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
    lifecyclestage: '',
    leadtype: ''
  };
  let from = event.from;
  let to = event.to;

  //if the string from contains a whatsapp prefix we need to remove it
  from = from.replace('whatsapp:', '');
  to = to.replace('whatsapp:', '');

  // Fix para brasil
  if (from.startsWith('+55')) {
    let tmpPhone = from.replace('+55', '');
    let prefix = tmpPhone.slice(0, 2);
    let validPrefixes = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34',
      '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65',
      '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92',
      '93', '94', '95', '96', '97', '98', '99'];
    if (validPrefixes.includes(prefix)) {
      let tmpPhoneWithoutPrefix = tmpPhone.slice(2);
      if (tmpPhoneWithoutPrefix.length === 8) {
        from = `+55${prefix}9${tmpPhoneWithoutPrefix}`
      }
    }
  }

  const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })

  await hubspotClient.crm.contacts.basicApi.create({
    properties: {
      firstname: 'Anonymous',
      lastname: 'Contact',
      phone: from,
      hs_lead_status: 'NEW',
      tipo_de_lead: event.leadtype ?? 'Llamada',
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
    result.leadtype = `${contact.properties?.tipo_de_lead ?? 'Llamada'}`;
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

