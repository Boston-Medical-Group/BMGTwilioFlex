import { Context, ServerlessCallback, ServerlessFunctionSignature } from "@twilio-labs/serverless-runtime-types/types";
import fetch from "node-fetch";
import { Client as HubspotClient } from '@hubspot/api-client'
import { CollectionResponseWithTotalSimplePublicObjectForwardPaging } from "@hubspot/api-client/lib/codegen/crm/contacts";

type EnvVars = {
    FLEXMANAGER_API_URL: string
    HUBSPOT_TOKEN: string
    TASK_ROUTER_WORKSPACE_SID: string
}

type OwnerResponse = {
    owner_id: string | null
}

const fetchOwner = async (context: Context<EnvVars>, phone: string): Promise<OwnerResponse> => {
    const result : OwnerResponse = {
        owner_id: null
    }

    if (phone === undefined || phone === '') {
        return result
    }
    // Obtiene el owner de un contacto en Hubspot según su número de teléfono  
    try {
        const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
        const hubspotResult = await hubspotClient.crm.contacts.searchApi.doSearch({
            'query': phone,
            'filterGroups': [],
            'sorts': ['phone'],
            //'query'?: string;
            'properties': ['firstname', 'lastname', 'owner_id'],
            'limit': 1,
            'after': 0
        }).then(async (response: CollectionResponseWithTotalSimplePublicObjectForwardPaging) => {
            if (response.total === 0) {
                return null
            } else {
                const contact = response.results[0]
                return await hubspotClient.crm.contacts.basicApi.getById(contact.properties.hs_object_id as string, ['hubspot_owner_id'])
                    .then(async response => {
                        const ownerId = response.properties?.hubspot_owner_id
                        const client = context.getTwilioClient();
                        return await client.taskrouter.v1
                            .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                            .workers
                            .list({
                                targetWorkersExpression: `hubspot_owner_id=${ownerId}`
                            }).then((workersList): null | string => {
                                if (workersList.length === 0) {
                                    return null
                                } else {
                                    return workersList[0]?.sid
                                }
                            }).catch(err => null)

                    })
                    .catch(err => null)
            }
        }).catch(err => null)

        result.owner_id = hubspotResult
    } catch (error) {
        console.log(error)
    }

    return result
}

type MyEvent = {
    from: string
}
export const handler  = async function (
    context: Context<EnvVars>,
    event: MyEvent,
    callback: ServerlessCallback
) {

    let phone = event.from.trim()
    if (!phone.startsWith('+')) {
        phone = `+${phone}`
    }
    const result = await fetchOwner(context, event.from)

    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");
    response.setBody(result);

    // Return a success response using the callback function.
    callback(null, response);

}