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
    EventType: string
    Body: string
    Author: string
    Source: "WHATSAPP" | "SMS"
    ConversationSid: string
    Attributes: {
        [key: string]: any
    }
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

    if (!event.Source || event.Source.toUpperCase() !== "WHATSAPP" || !event.Body || event.Body === '') {
        return
    }

    const defaultSettings = optoput.optoutSettings.default
    const countrySettings = optoput.optoutSettings[context.COUNTRY ?? ''] ?? {}
    const optoutWords = defaultSettings.OPT_OUT_TEXT.concat(countrySettings.OPT_OUT_TEXT ?? [])
    const body = event.Body.toLowerCase().trim()
    if (!optoutWords.includes(body)) {
        return
    }

    // Phone
    let author = event.Author
    if (author.startsWith('whatsapp:')) {
        author = author.slice(9);
    }

    await doOptInOrOut(context, event, author, false).then(async () => {
        const conversation = context.getTwilioClient().conversations.v1.conversations(event.ConversationSid)
        await conversation.messages.create({
            author: 'System',
            body: countrySettings['OPT_OUT_MESSAGE'] ?? defaultSettings['OPT_OUT_MESSAGE'],
        }).then(async () => {
            await conversation.update({
                state: 'closed'
            })
        })
    })
}

/**
 * Comprueba si el mensaje es un opt-in de whatsapp y lo inscribe en hubspot
 * @param context 
 * @param event 
 */
const checkOptIn = async (context: Context<MyContext>, event: MyEvent) => {
    if (!event.Source || event.Source.toUpperCase() !== "WHATSAPP" || !event.Body || event.Body === '') {
        return
    }

    const defaultSettings = optoput.optoutSettings.default
    const countrySettings = optoput.optoutSettings[context.COUNTRY ?? ''] ?? {}
    const optoutWords = defaultSettings.OPT_IN_TEXT.concat(countrySettings.OPT_IN_TEXT ?? [])
    const body = event.Body.toLowerCase().trim()
    if (!optoutWords.includes(body)) {
        return
    }

    // Phone
    let author = event.Author
    if (author.startsWith('whatsapp:')) {
        author = author.slice(9);
    }

    await doOptInOrOut(context, event, author, true).then(async () => {
        const conversation = context.getTwilioClient().conversations.v1.conversations(event.ConversationSid)
        await conversation.messages.create({
            author: 'System',
            body: countrySettings['OPT_IN_MESSAGE'] ?? defaultSettings['OPT_IN_MESSAGE'],
        })
    })

}

//@ts-ignore
export const handler = async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) {

    if (event.EventType === "onMessageAdded") {
        await checkOptOut(context, event)
        await checkOptIn(context, event)
    }

    callback(null);

}