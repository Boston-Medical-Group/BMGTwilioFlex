import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from "@twilio/flex-ui";

import { initializeCustomCallSids } from './initializers/initializeCustomCallSids';
import { initializeOutboundCall } from './initializers/initializeOutboundCall';
//import CustomizePasteElements from './utils/PasteThemeProvider';
import addWhatsAppTemplatesDropdownToMessageInputActions from './flex-hooks/components/MessageInputActions';
import InteractionCard from './components/InteractionCard/InteractionCard';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import { namespace, reducers } from './states';
import InteractionContainer from './components/InteractionContainer';

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
    manager.store.addReducer?.(namespace, reducers);
    
    const options = { sortOrder: 1000 };

    //flex.NoTasksCanvas.Content.add(<InteractionCard key="HubspotInteractPlugin-component" manager={manager} />, options);
    flex.AgentDesktopView.Panel2.Content.replace(<InteractionContainer key="InteractionContainer-component" flex={flex} manager={manager} />, options);

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
