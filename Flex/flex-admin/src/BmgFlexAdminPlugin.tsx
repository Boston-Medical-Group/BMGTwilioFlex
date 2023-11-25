import { Monitor, VERSION } from '@twilio/flex-ui';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import reducers, { namespace } from './states';
import { initializeSettings } from './initializers/initializeSettings';
import { initializeDonotcall } from './initializers/initializeDonotcall';
import { initializeBlacklist } from './initializers/initializeBlacklist';
import { initializeDowntimeManager } from './initializers/initializeDowntimeManager';
import { initializeWrapupCodes } from './initializers/initializeWrapupCodes';
import axios from 'axios'
import { hasAdminRights } from './helpers';

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
        this.registerReducers(manager);

        axios.defaults.baseURL = `${manager.serviceConfiguration.attributes.AdminBMGPlugin.dbManagerEndpoint}/api/v1/`;
        axios.defaults.headers.common['Authorization'] = `Bearer ${manager.serviceConfiguration.attributes.AdminBMGPlugin.dbManagerToken}`;
        axios.defaults.headers.common['Accept'] = 'application/vnd.api+json';
      
        initializeSettings(flex, manager);
        initializeDonotcall(flex, manager);
        initializeBlacklist(flex, manager);
        initializeDowntimeManager(flex, manager);
        initializeWrapupCodes(flex, manager);
    }

    /**
     * Registers the plugin reducers
     *
     * @param manager { Flex.Manager }
     */
    registerReducers(manager : Flex.Manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }

}
