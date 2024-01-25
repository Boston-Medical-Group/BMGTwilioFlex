import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization'

import OpenaiAsistantButton from './components/OpenaiAssistantButton';

const PLUGIN_NAME = 'FlexOpenaiAssistantPlugin';

export default class FlexOpenaiAssistantPlugin extends FlexPlugin {
    constructor() {
        super(PLUGIN_NAME);
    }

    /**
     * This code is run when your plugin is being started
     * Use this to modify any UI components or attach to the actions framework
     *
     * @param flex { typeof Flex }
     */
    async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
        const options: Flex.ContentFragmentProps = {
            sortOrder: -1,
            if: () => {
                const roles = manager?.store?.getState()?.flex?.session?.ssoTokenPayload?.roles
                return roles.indexOf('admin') >= 0;
            }
        };

        flex.setProviders({
            PasteThemeProvider: CustomizationProvider
        })

        flex.MessageInputActions.Content.add(<OpenaiAsistantButton manager={manager} key="openai-assistant-button" />, options);
    }
}
