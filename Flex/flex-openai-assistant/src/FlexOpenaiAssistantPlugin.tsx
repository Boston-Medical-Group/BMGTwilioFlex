import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization'
import { Paragraph } from '@twilio-paste/core';

import OpenaiAsistantButton from './components/OpenaiAssistantButton';
import OpenaiSummaryButton from './components/OpenaiSummaryButton';
import OpenaiSummaryContainer from './components/OpenaiSummaryContainer';

import { namespace, reducers } from './states';

const PLUGIN_NAME = 'FlexOpenaiAssistantPlugin';

export default class FlexOpenaiAssistantPlugin extends FlexPlugin {
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
    async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
        //@ts-ignore
        manager.store.addReducer(namespace, reducers);

        const options: Flex.ContentFragmentProps = {
            sortOrder: -1,
            if: () => {
                const roles = manager?.store?.getState()?.flex?.session?.ssoTokenPayload?.roles
                const skills = manager.workerClient?.attributes?.routing?.skills as Array<string> || []
                return roles.indexOf('admin') >= 0 || skills?.indexOf('Whatsapp_IA_User') >= 0 || skills?.indexOf('IA_Summary') >= 0;
            }
        };

        flex.setProviders({
            PasteThemeProvider: CustomizationProvider
        })

        flex.MessageInputActions.Content.add(<OpenaiAsistantButton manager={manager} key="openai-assistant-button" />, options);
        flex.MessageInputActions.Content.add(<OpenaiSummaryButton manager={manager} key="openai-summary-button" />, options);

        flex.MessageInputV2.Content.add(<OpenaiSummaryContainer key="summary-container" manager={manager} />, {
            if: () => {
                const roles = manager?.store?.getState()?.flex?.session?.ssoTokenPayload?.roles
                const skills = manager.workerClient?.attributes?.routing?.skills as Array<string> || []
                return roles.indexOf('admin') >= 0 || skills?.indexOf('IA_Summary') >= 0;
            }
        })
    }
}
