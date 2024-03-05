import { functionValidator as FunctionTokenValidator } from "twilio-flex-token-validator";
import { Client as HubspotClient } from "@hubspot/api-client";
import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { SimplePublicObjectInputForCreate } from "@hubspot/api-client/lib/codegen/crm/objects/communications";
import { SimplePublicObject, CollectionResponseWithTotalSimplePublicObjectForwardPaging } from '@hubspot/api-client/lib/codegen/crm/contacts';
const optoputSettings = require(Runtime.getFunctions()['helpers/optout'].path);

type MyContext = {
    HUBSPOT_TOKEN: string,
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

const checkOptOut = () => {

}

//@ts-ignore
export const handler = FunctionTokenValidator(async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) {

    checkOptOut()

})