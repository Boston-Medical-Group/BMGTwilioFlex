import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObject, CollectionResponseWithTotalSimplePublicObjectForwardPaging } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';

/** Receives a phone number, queries HUBSPOT and returns the customer record.
* If the CRM has a duplicate number, the function returns the first record (usually the oldest)
*/

type MyContext = {
    HUBSPOT_TOKEN: string
}

type MyEvent = {
    objectType: string
    objectId: string
} & (
        {
            property: string
            value: string
        } | {
            property: string[]
            value: string[]
        }
    );

exports.handler = async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) {

    let { objectType, objectId, property, value } = event;

    let check = false;
    if (typeof property === 'string' && typeof value === 'string') {
        check = true;
    } else if (Array.isArray(property) && Array.isArray(value)) {
        if (property.length === value.length) {
            check = true;
        }
    }

    // Validar propiedades
    if (!check) {
        return callback('Both property and value should be a string or an array with the items length for property and value')
    }

    let properties: { [key: string]: string } = {  };
    if (typeof property === 'string') {
        //@ts-ignore
        properties[property] = value;
    } else if (Array.isArray(property)) {
        properties = property.reduce((map, key, index) => {
            //@ts-ignore
            map[key] = value[index];
            return map;
        }, {});
    }

    const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
    console.info('Updating properties : ' + JSON.stringify(properties));
    await hubspotClient.crm.objects.basicApi.update(objectType, objectId, {
        properties
    }).then(function (contact: SimplePublicObject) {
        //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
        callback(null, {});
    }).catch(function (error) {
        console.log(`Error updateObjectProperty@67: ${error}`);
        callback(null, error);
    });
};

