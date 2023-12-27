import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import SyncHubspotUser from './components/SyncHubspotUser';

const PLUGIN_NAME = 'HubspotCrmPlugin';

export default class HubspotCrmPlugin extends FlexPlugin {
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

    flex.AgentDesktopView.Panel1.Content.add(<SyncHubspotUser key="HubspotCrmPlugin-component-SyncHubspotUser" manager={manager} />)

    let currentCrmId = null;

    //If there is a task and the task has a crm ID, screenpop customer record. Otherwise show the list of contacts
    flex.CRMContainer.defaultProps.uriCallback = (task) => {
      if (task && task.attributes.crmid) {
        currentCrmId = task.attributes.crmid;
      }

      if (currentCrmId)
        return `https://app-eu1.hubspot.com/contacts/${process.env.FLEX_APP_HUBSPOT_CRMID}/contact/${currentCrmId}`
      else
        return `https://app-eu1.hubspot.com/contacts/${process.env.FLEX_APP_HUBSPOT_CRMID}/contacts/list/view/all/`;
    }
  }
}
