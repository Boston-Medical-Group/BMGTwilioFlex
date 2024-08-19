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
        leadorpatient: 'lead',
        tf_default_queue: '',
        tf_default_workflow: ''
    };
    let from = event.from;

    if (event.from === undefined) {
        return callback({ error: 'from is required' });
    }

    //if the string from contains a whatsapp prefix we need to remove it
    from = from.replace('whatsapp:', '');
    from = from.replace(' ', '+');
    let fromWithoutPrefix = removePrefix(from, ['+593', '+52', '+521', '+34', '+1', '+51', '+54', '+56', '+57', '+55'])

    let filterGroups: any = [
        {
            filters: [
                {
                    propertyName: 'phone',
                    operator: 'EQ',
                    value: from
                }
            ]
        },
        {
            filters: [
                {
                    propertyName: 'phone',
                    operator: 'CONTAINS_TOKEN',
                    value: `*${fromWithoutPrefix}`
                }
            ]
        }
    ]

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
                filterGroups.push({
                    filters: [
                        {
                            propertyName: 'phone',
                            operator: 'CONTAINS_TOKEN',
                            value: `*${prefix}9${tmpPhoneWithoutPrefix}`
                        }
                    ]
                })
            } else {
                filterGroups.push({
                    filters: [
                        {
                            propertyName: 'phone',
                            operator: 'CONTAINS_TOKEN',
                            value: `*${prefix}${tmpPhoneWithoutPrefix.slice(1)}`
                        }
                    ]
                })
            }
        }
    }

    const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
    await hubspotClient.crm.contacts.searchApi.doSearch({
        //query: from,
        filterGroups,
        //@ts-ignore
        sorts: [{
            propertyName: 'phone',
            direction: 'ASCENDING'
        }],
        properties: ['firstname', 'lastname', 'lifecyclestage', 'phone'],
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
            result.tf_default_queue = contact.properties?.tf_default_queue ?? '';
            result.tf_default_workflow = contact.properties?.tf_default_workflow ?? '';
            if ((result.lifecyclestage != 'lead') && (result.lifecyclestage != 'marketingqualifiedlead') && (result.lifecyclestage != 'opportunity' && (result.lifecyclestage !== 'subscriber'))) {
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

const removePrefix = (phone: string , prefixes: string[]) => {
    for (let prefix of prefixes) {
        if (phone.startsWith(prefix)) {
            phone = phone.slice(prefix.length);
            break;
        }
    }
    return phone;
}