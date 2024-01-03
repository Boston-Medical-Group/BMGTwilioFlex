/**
 * Obtiene la URL de reservar_cita de la API de Hubspot
 * según el contacto o el negocio activo.
 */

import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { ServerlessFunctionSignature, Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { functionValidator as TokenValidator, Event, Callback } from 'twilio-flex-token-validator';

const fetchCalendarUrlByContactId = async (context: Context, client: HubspotClient, contactId: string, calendarUrlField: string): Promise<null | string> => {
    
    return await client.crm.contacts.basicApi.getById(contactId, ['reservar_cita'])
        .then((response: SimplePublicObjectWithAssociations) => {
            if (response.properties[calendarUrlField]) {
                return response.properties[calendarUrlField]
            } else {
                return null
            }
        }).catch(err => {
            console.log(err)
            return null
        })
}

const fetchCalendarUrlByDealId = async (context: Context, client: HubspotClient, dealId: string, calendarUrlField: string) : Promise<null|string> => {
    return await client.crm.deals.basicApi.getById(dealId, ['reservar_cita'])
        .then((response: SimplePublicObjectWithAssociations) => {
            if (response.properties[calendarUrlField]) {
                return response.properties[calendarUrlField]
            } else {
                return null
            }
        })
}

type MyEvent = {
    calendar_url_field: string
    contact_id?: string
    deal_id?: string
} & Event

type MyContext = {
    HUBSPOT_TOKEN: string
}

//@ts-ignore
export const handler = TokenValidator(async (context: Context<MyContext>, event: MyEvent, callback: Callback) => {
//export const handler = async (context: Context<MyContext>, event: MyEvent, callback: Callback) => {
    const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })

    if (event['calendar_url_field'] === undefined || event['calendar_url_field'] === '') {
        event.calendar_url_field = 'reservar_cita'
    }

    let calendarUrl: string | null = ''
    if (event.deal_id && event.deal_id !== '') {
        calendarUrl = await fetchCalendarUrlByDealId(context, hubspotClient, event.deal_id, event.calendar_url_field)
    } else if (event.contact_id && event.contact_id !== '') {
        calendarUrl = await fetchCalendarUrlByContactId(context, hubspotClient, event.contact_id, event.calendar_url_field)
    }

    //@ts-ignore
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");
    response.setBody({ calendarUrl });

    // Return a success response using the callback function.
    callback(null, response);
})