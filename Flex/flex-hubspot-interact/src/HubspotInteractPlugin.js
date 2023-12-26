import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from "@twilio/flex-ui";

import { initializeCustomCallSids } from './initializers/initializeCustomCallSids';
import { initializeOutboundCall } from './initializers/initializeOutboundCall';
import InteractionCard from './components/InteractionCard/InteractionCard';

import { namespace, reducers } from './states';

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

    flex.NoTasksCanvas.Content.add(<InteractionCard key="HubspotInteractPlugin-component" manager={manager} />, options);

    flex.AgentDesktopView.defaultProps.splitterOptions = {
      initialFirstPanelSize: "300px",
      minimumFirstPanelSize: "300px"
      //minimumSecondPanelSize: "xx%"
    };
    
    // Fetch CallerID from Pools
    initializeCustomCallSids(Flex, manager);

    initializeOutboundCall(Flex, manager);
  }
}
