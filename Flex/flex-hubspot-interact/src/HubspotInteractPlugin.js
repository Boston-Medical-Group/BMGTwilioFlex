import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';

import InteractionCard from './components/InteractionCard/InteractionCard';

const PLUGIN_NAME = 'HubspotInteractPlugin';

export default class HubspotInteractPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    const options = { sortOrder: 1000 };

    flex.NoTasksCanvas.Content.add(<InteractionCard key="HubspotInteractPlugin-component" manager={manager} />, options);

    async function loadHubspotData(data) {
      let bodytoSend = {};
      if (data.contact_id) {
        bodytoSend = {
          crmid: data.contact_id,
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
    
    async function receiveMessage(event) {
      // Invoke the Flex Outbound Call Action
      const { data } = event;
      if (data.from === 'FLEX_SCRIPT') {
        if (data.actionType === 'dial') {
          const response = await loadHubspotData(data);
          const contact = response.properties ?? {};

          flex.Actions.invokeAction("StartOutboundCall", {
            destination: contact.phone ?? data.phone,
            taskAttributes: {
              name: `${contact.firstname || ''} ${contact.lastname || ''}`.trim(),
              hubspot_contact_id: contact.hs_object_id,
              
            }
          });
        } else if (data.actionType === 'gotoCustomer') {
          const response = await loadHubspotData(data);
          const contact = response.properties ?? {};
          // todo navigate to customer view with route params (crmid)
          flex.Actions.invokeAction("NavigateToView", { viewName: data.viewName, crmid: contact.hs_object_id });

        }

      }

    }

    // Add an event listener to associate the postMessage() data with the receiveMessage logic
    window.addEventListener("message", receiveMessage, false);
    

  }
}
