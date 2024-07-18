import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import { Client as HubspotClient } from '@hubspot/api-client'
import { CollectionResponseWithTotalSimplePublicObjectForwardPaging as ContactsCollection } from "@hubspot/api-client/lib/codegen/crm/contacts";
import { CollectionResponseWithTotalSimplePublicObjectForwardPaging as DealsCollection } from "@hubspot/api-client/lib/codegen/crm/deals";

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

    console.log('FETCHKNOWNWORKER LOKING FOR:', phone)
    if (phone === undefined || phone === '') {
        return result
    }
    // Obtiene el contacto según su telefono
    try {
        const hubspotClient = new HubspotClient({ accessToken: context.HUBSPOT_TOKEN })
        const hubspotResult = await hubspotClient.crm.contacts.searchApi.doSearch({
            query: phone,
            filterGroups: [],
            sorts: ['phone'],
            properties: ['firstname', 'lastname', 'hubspot_owner_id'],
            limit: 1,
            after: 0
        }).then(async (contacts: ContactsCollection) => {
            if (contacts.total > 0) {
                console.log('FETCHKNOWNWORKER CONTACTS FOUND', contacts.total)
                // Obtiene el negocio más reciente del contacto
                return await hubspotClient.crm.deals.searchApi.doSearch({
                    filterGroups: [{
                        filters: [
                            {
                                propertyName: "associations.contact",
                                operator: "EQ",
                                value: `${contacts.results[0].properties.hs_object_id}`
                            }, {
                                propertyName: "hs_is_open_count",
                                operator: "EQ",
                                value: "1"
                            }
                        ]
                    }],
                    sorts: ["hs_lastmodifieddate"],
                    limit: 1,
                    properties: ["hubspot_owner_id"],
                    after: 0
                })
                    .then(async (deals: DealsCollection) => {
                        console.log('FETCHKNOWNWORKER DEALS FOUND', deals.total)
                        return deals.total > 0
                            ? deals.results[0].properties.hubspot_owner_id
                            : (contacts.total > 0
                                ? contacts.results[0].properties.hubspot_owner_id
                                : null)
                        }
                    )
                    .catch((err) => {
                        console.log('FETCHKNOWNWORKER ERR 64', JSON.stringify(err))
                        return null
                })
            }

            return null
        }).catch((err) => {
            console.log(err)
            return null
        })

        if (hubspotResult !== null) {
            console.log('FETCHKNOWNWORKER', hubspotResult)
            const client = context.getTwilioClient();
            result.owner_id = await client.taskrouter.v1
                .workspaces(context.TASK_ROUTER_WORKSPACE_SID)
                .workers
                .list({
                    targetWorkersExpression: `hubspot_owner_id=${hubspotResult}`
                })
                .then((workersList): null | string => workersList.length === 0 ? null : workersList[0]?.sid)
                .catch(err => null)
        }
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
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");

    let result;
    try {
        let phone = event.from.trim()
        if (phone.startsWith('whatsapp:')) {
            phone = phone.slice(9);
        }
        if (!phone.startsWith('+')) {
            phone = `+${phone}`
        }

        result = await fetchOwner(context, phone)
    } catch (error) {
        result = { status: 'err' }
        response.setStatusCode(500);
    }

    response.setBody(result);

    // Return a success response using the callback function.
    callback(null, response);

}