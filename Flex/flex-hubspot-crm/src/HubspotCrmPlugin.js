import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import SyncHubspotUser from './components/SyncHubspotUser';
import ContactCard from './components/ContactCard';
import { Notifications, NotificationType } from '@twilio/flex-ui';

const PLUGIN_NAME = 'HubspotCrmPlugin';


const registerNotifications = () => {
  Notifications.registerNotification({
    id: "errorLoadingConversations",
    content: "Error al cargar las conversaciones",
    type: NotificationType.error
  });

  Notifications.registerNotification({
    id: "errorNotEnoughMessages",
    content: "No hay suficiente contexto para generar una sugerencia",
    type: NotificationType.error
  });

  Notifications.registerNotification({
    id: "errorLoadingConversationMessages",
    content: "Error al cargar la conversación",
    type: NotificationType.error
  });
}

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

    registerNotifications()
    flex.AgentDesktopView.Panel1.Content.add(<SyncHubspotUser key="HubspotCrmPlugin-component-SyncHubspotUser" manager={manager} />)

    flex.Actions.addListener("afterAcceptTask", (payload) => {
      if (payload.task.attributes.direction.toLowerCase() === 'inbound' && payload.task.attributes.crmid) {
        window.open(`https://app-eu1.hubspot.com/contacts/${process.env.FLEX_APP_HUBSPOT_CRMID}/contact/${payload.task.attributes.crmid}`, '_blank');
      }

      if (payload.task && payload.task?.attributes?.hubspot_contact_id !== '' || payload.task?.attributes?.hubspotContact) {
        flex.AgentDesktopView.Panel2.Content.replace(
          <ContactCard key="HubspotCrmPlugin-component-ContactCard"
            task={payload.task}
            manager={manager}
            contact={payload.task.attributes?.hubspotContact}
            contactId={payload.task.attributes?.hubspot_contact_id}
          />, {
            if: () => payload.task
          }
        )
      }
    });

    flex.Actions.addListener("afterSelectTask", (payload) => {
      if (payload.task && payload.task?.attributes?.hubspot_contact_id !== '' || payload.task?.attributes?.hubspotContact) {
        flex.AgentDesktopView.Panel2.Content.replace(
          <ContactCard key={`HubspotCrmPlugin-component-ContactCard-${payload.task.sid}`}
            task={payload.task}
            manager={manager}
          />
        )
      }
    })

    flex.Actions.addListener("afterTaskComplete", (payload) => {
      flex.AgentDesktopView.Panel2.Content.remove('HubspotCrmPlugin-component-ContactCard')
    })


    /**
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
    */
  }
}
