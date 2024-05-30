import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/objects';
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

    let props: { [key: string]: string } = {  };
    if (typeof property === 'string') {
        //@ts-ignore
        props[property] = value;
    } else if (Array.isArray(property)) {
        props = property.reduce((map, key, index) => {
            //@ts-ignore
            map[key] = value[index];
            return map;
        }, {});
    }

    const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
    console.info(props);
    console.info('Updating properties : ' + JSON.stringify(props));
    let result: any;
    await hubspotClient.crm.objects.basicApi.update(objectType, objectId, {
        properties: props
    }).then(function (contact: SimplePublicObject) {
        //the result object stores the data you need from hubspot. In this example we're returning the CRM ID, first name and last name only.
        result = {}
    }).catch (function (error) {
        result = { error: `Error updateObjectProperty@67: ${error}` }
    });

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");
    response.setBody(result);

    callback(null, response);
};

