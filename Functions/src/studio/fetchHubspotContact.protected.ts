import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObject, CollectionResponseWithTotalSimplePublicObjectForwardPaging } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';

type MyContext = {
    HUBSPOT_TOKEN: string
    COUNTRY: string
}

type MyEvent = {
    from: string
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
        lifecyclestage: 'lead',
        leadorpatient: 'lead'
    };
    let from = event.from;

    //if the string from contains a whatsapp prefix we need to remove it
    from = from.replace('whatsapp:', '');

    const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
    await hubspotClient.crm.contacts.searchApi.doSearch({
        query: from,
        filterGroups: [],
        sorts: ['phone'],
        properties: ['firstname', 'lastname', 'lifecyclestage'],
        limit: 1,
        after: 0
    }).then((contacts: CollectionResponseWithTotalSimplePublicObjectForwardPaging) => {
        if (contacts.total > 0) {
            let contact: SimplePublicObject = contacts.results[0];
            //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
            result.crmid = `${contact.id}`; //required for screenpop
            result.firstname = `${contact.properties.firstname}`;
            result.lastname = `${contact.properties.lastname}`;
            result.fullname = `${contact.properties.firstname ?? ''} ${contact.properties.lastname ?? ''}`;
            result.lifecyclestage = `${contact.properties?.lifecyclestage ?? 'lead'}`;
            if ((result.lifecyclestage != 'lead') && (result.lifecyclestage != 'marketingqualifiedlead') && (result.lifecyclestage != 'opportunity')) {
                result.leadorpatient = 'patient';
            }
            if (result.fullname.trim() == '') {
                result.fullname = 'Customer'
            }

            callback(null, result);
        } else {
            callback(null, {});
        }
    }).catch(function (error) {
        // handle error
        console.log(`Error: ${error}`);
        callback(null, error);
    });
};