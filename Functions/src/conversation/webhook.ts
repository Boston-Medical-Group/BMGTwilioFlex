import { functionValidator as FunctionTokenValidator } from "twilio-flex-token-validator";
import { Client as HubspotClient } from "@hubspot/api-client";
import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { CollectionResponseWithTotalSimplePublicObjectForwardPaging as ContactsCollection } from "@hubspot/api-client/lib/codegen/crm/contacts";
import { SimplePublicObject, CollectionResponseWithTotalSimplePublicObjectForwardPaging } from '@hubspot/api-client/lib/codegen/crm/contacts';

const optoput = require(Runtime.getFunctions()['helpers/optout'].path);

type MyContext = {
    HUBSPOT_TOKEN: string,
    COUNTRY?: string
}

type MyEvent = {
    Body: string
    From: string
    To: string
    OptOutType?: "STOP" | "START"
    [key: string]: any
}


const doOptInOrOut = async (context: Context<MyContext>, event : MyEvent, author: string, optIn: boolean) => {
    // OptOut
    const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
    await hubspotClient.crm.contacts.searchApi.doSearch({
        query: author,
        filterGroups: [],
        sorts: ['phone'],
        properties: ['firstname', 'lastname', 'hubspot_owner_id'],
        limit: 5,
        after: 0
    }).then(async (contacts: ContactsCollection) => {
        if (contacts.total > 0) {
            await hubspotClient.crm.contacts.batchApi.update({
                inputs: contacts.results.map((contact) => {
                    return {
                        id: contact.id,
                        properties: {
                            'whatsappoptout': optIn ? 'false' : 'true'
                        }
                    }
                })
            }).then(() => {
                console.log('Success')
            }).catch((err) => {
                console.log(err)
            })
        }

        return null
    }).catch((err) => {
        console.log(err)
        return null
    })
}

/**
 * Comprueba si el mensaje es un opt-out de WhatsApp y lo excluye
 */
const checkOptOut = async (context: Context<MyContext>, event: MyEvent) => {
    if (!event.OptOutType) {
        return
    }

    // Phone
    let author = event.From
    if (author.startsWith('whatsapp:')) {
        author = author.slice(9);
    }

    await doOptInOrOut(context, event, author, false)
}

/**
 * Comprueba si el mensaje es un opt-in de whatsapp y lo inscribe en hubspot
 * @param context 
 * @param event 
 */
const checkOptIn = async (context: Context<MyContext>, event: MyEvent) => {
    if (!event.OptOutType) {
        return
    }

    // Phone
    let author = event.From
    if (author.startsWith('whatsapp:')) {
        author = author.slice(9);
    }

    await doOptInOrOut(context, event, author, true)

}

//@ts-ignore
export const handler = async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) {

    if (event.OptOutType) {
        if (event.OptOutType === 'STOP') {
            await checkOptOut(context, event)
        } else if (event.OptOutType === 'START') {
            await checkOptIn(context, event)
        }
    }

    callback(null, {});

}