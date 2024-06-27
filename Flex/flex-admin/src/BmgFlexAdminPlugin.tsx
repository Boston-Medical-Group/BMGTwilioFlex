import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import { initializeSettings } from './initializers/initializeSettings';
import { initializeDonotcall } from './initializers/initializeDonotcall';
import { initializeBlacklist } from './initializers/initializeBlacklist';
import { initializeInboundConfigs } from './initializers/initializeInboundConfigs';
import { initializeGeoPermissions } from './initializers/initializeGeoPermissions';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import axios from 'axios'

const PLUGIN_NAME = 'BmgFlexAdminPlugin';

export default class BmgFlexAdminPlugin extends FlexPlugin {
    constructor() {
        super(PLUGIN_NAME);
    }

    /**
     * This code is run when your plugin is being started
     * Use this to modify any UI components or attach to the actions framework
     *
     * @param flex { typeof import('@twilio/flex-ui') }
     * @param manager { import('@twilio/flex-ui').Manager }
     */
    async init(flex : typeof Flex, manager: Flex.Manager) {

        axios.defaults.baseURL = `${manager.serviceConfiguration.attributes.AdminBMGPlugin.dbManagerEndpoint}/api/v1/`;
        axios.defaults.headers.common['Authorization'] = `Bearer ${manager.serviceConfiguration.attributes.AdminBMGPlugin.dbManagerToken}`;
      axios.defaults.headers.common['Accept'] = 'application/vnd.api+json';

      Flex.setProviders({
        PasteThemeProvider: CustomizationProvider
      });
      
        initializeSettings(flex, manager);
        initializeDonotcall(flex, manager);
        initializeBlacklist(flex, manager);
        initializeInboundConfigs(flex, manager);
        initializeGeoPermissions(flex, manager);
    }
}
