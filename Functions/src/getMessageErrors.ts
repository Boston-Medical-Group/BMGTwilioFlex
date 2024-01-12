/**
 * Obtiene la URL de reservar_cita de la API de Hubspot
 * según el contacto o el negocio activo.
 */

import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { ServerlessFunctionSignature, Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import * as twilio from 'twilio';
import { functionValidator as TokenValidator, Event, Callback } from 'twilio-flex-token-validator';
import { MessageInstance } from 'twilio/lib/rest/conversations/v1/conversation/message';
import { DeliveryReceiptInstance } from 'twilio/lib/rest/conversations/v1/conversation/message/deliveryReceipt';

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

const fetchCalendarUrlByDealId = async (context: Context, client: HubspotClient, dealId: string, calendarUrlField: string): Promise<null | string> => {
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
    conversationSid: string
} & Event

type Error = {
    date: Date
    code: number
}
//@ts-ignore
export const handler = TokenValidator(async (context: Context<MyContext>, event: MyEvent, callback: Callback) => {

    const errors : Error[] = []
    const client: twilio.Twilio = context.getTwilioClient()

    try {
        await client.conversations.v1.conversations(event.conversationSid).messages.list({
            limit: 1,
            order: 'desc'
        }).then(async (messages: MessageInstance[]) : any => {
            if (messages.length > 0) {
                const message = messages[0]
                const receipts = message.deliveryReceipts()
                await receipts.list({})
                    .then(async (deliveryReceipts: DeliveryReceiptInstance[]) => {
                        const codes :Error[] = []
                        deliveryReceipts.forEach((deliveryReceipt: DeliveryReceiptInstance) => {
                            if (deliveryReceipt.errorCode !== null) {
                                codes.push({
                                    date: deliveryReceipt.dateCreated,
                                    code: deliveryReceipt.errorCode
                                })
                            }
                        })

                        errors.push(...codes)
                    })
            }
        })
        
    } catch (err) {
        console.log(err)
    }

    //@ts-ignore
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");
    response.setBody(errors);

    // Return a success response using the callback function.
    callback(null, response);
})