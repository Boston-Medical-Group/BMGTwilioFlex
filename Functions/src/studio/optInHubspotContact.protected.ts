import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';

type MyContext = {
    HUBSPOT_TOKEN: string
    COUNTRY: string
}

type MyEvent = {
    contact_id: string
    channel?: string
    silent?: boolean
}

exports.handler = async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) {

    const contact_id = event.contact_id
    const channel = event.channel ?? false
    const silent = event.silent ?? true

    if (!channel) {
        callback(null, {});
    }

    // OptIn
    const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
    await hubspotClient.crm.contacts.basicApi.update(contact_id, {
        properties: {
            'whatsappoptout': 'false'
        }
    }).then(async (contact: SimplePublicObject) => {
        if (!silent) {
            // Todo: agregar notificación
        }

        callback(null, {});
    }).catch((err) => {
        console.log(err)
        callback(null, {error: err});
    })
};