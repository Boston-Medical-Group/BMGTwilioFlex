import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from "@twilio/flex-ui";
import { Notifications, NotificationType } from '@twilio/flex-ui';
import { initializeCustomCallSids } from './initializers/initializeCustomCallSids';
import { initializeOutboundCall } from './initializers/initializeOutboundCall';
//import CustomizePasteElements from './utils/PasteThemeProvider';
import addWhatsAppTemplatesDropdownToMessageInputActions from './flex-hooks/components/MessageInputActions';
import InteractionCard from './components/InteractionCard/InteractionCard';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import { namespace, reducers } from './states';
import InteractionContainer from './components/InteractionContainer';

const PLUGIN_NAME = 'HubspotInteractPlugin';

const registerNotifications = () => {
  Notifications.registerNotification({
    id: "ALREADY_ACTIVE_CONVERSATION_WITH_ANOTHER_AGENT",
    content: "Al parecer el contacto con el que desea interactuar ya es encuentra en interacción con otro agente",
    type: NotificationType.error
  });

  Notifications.registerNotification({
    id: "ALREADY_ACTIVE_CONVERSATION_WITH_AGENT",
    content: "Ya está interactuando con este contacto. Si esto es un error póngase en contacto con un Administrador",
    type: NotificationType.error
  });

  Notifications.registerNotification({
    id: "ALREADY_ACTIVE_CONVERSATION_WITHOUT_AGENT",
    content: "Al parecer este contacto se encuentra en una interacción activa. Si esto es un error póngase en contacto con un Administrador",
    type: NotificationType.error
  });
}

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
    manager.store.addReducer(namespace, reducers);

    registerNotifications();
    
    const options = { sortOrder: 1000 };

    //flex.NoTasksCanvas.Content.add(<InteractionCard key="HubspotInteractPlugin-component" manager={manager} />, options);
    flex.AgentDesktopView.Panel1.Content.add(<InteractionContainer key="InteractionContainer-component" flex={flex} manager={manager} />, options);

    flex.AgentDesktopView.defaultProps.splitterOptions = {
      initialFirstPanelSize: "800px",
      minimumFirstPanelSize: "800px"
      //minimumSecondPanelSize: "xx%"
    };
    
    // Fetch CallerID from Pools
    initializeCustomCallSids(Flex, manager);

    //initializeOutboundCall(Flex, manager);

    //CustomizePasteElements(flex, manager);
    Flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    });

    addWhatsAppTemplatesDropdownToMessageInputActions(flex, manager);
  }
}
