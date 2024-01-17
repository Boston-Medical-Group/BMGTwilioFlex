import * as Flex from "@twilio/flex-ui";
import { actions, AppState } from '../states';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

type HubspotRequestData = {
    contact_id?: string;
    deal_id?: string;
}
async function loadHubspotData(data : HubspotRequestData, manager : Flex.Manager) {
    let bodytoSend = {};
    if (data.contact_id) {
        bodytoSend = {
            contact_id: data.contact_id,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        }
    } else if (data.deal_id) {
        bodytoSend = {
            deal_id: data.deal_id,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        }
    } else {
        return;
    }

    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotContact`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodytoSend)
    });

    return await request.json();
}

export const initializeOutboundCall = async (flex : typeof Flex, manager: Flex.Manager) => {

    //@ts-ignore
    const callCard = manager.store.getState().interactionCallCardState.interactionCallCard.callCard;

    async function receiveMessage(event : { data: any }) {
        // Invoke the Flex Outbound Call Action
        const { data } = event;
        if (data.from === 'FLEX_SCRIPT') {
            if (data.actionType === 'dial') {
                const response = await loadHubspotData(data, manager);
                const contact = response.properties ?? {};

                contact.phone = contact.phone ?? data.phone;
                manager.store.dispatch(actions.interactionCallCard.setCallCard({
                    data: contact,
                    dealId: data.deal_id ?? null
                }))
            } else if (data.actionType === 'gotoCustomer') {
                const response = await loadHubspotData(data, manager);
                const contact = response.properties ?? {};
                // todo navigate to customer view with route params (contact_id)
                Flex.Actions.invokeAction("NavigateToView", { viewName: data.viewName, contact_id: contact.hs_object_id });

            }

        }
    }

    // Add an event listener to associate the postMessage() data with the receiveMessage logic
    window.addEventListener("message", receiveMessage, false);

}