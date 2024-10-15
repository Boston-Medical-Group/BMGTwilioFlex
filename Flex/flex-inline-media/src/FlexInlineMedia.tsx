import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import InlineMedia from './components/InlineMedia';

const PLUGIN_NAME = 'FlexInlineMedia';

export default class FlexInlineMedia extends FlexPlugin {
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
        flex.MessageBubble.Content.add(<InlineMedia key="inline-media-component" />, {
            sortOrder: 0,
            //@ts-ignore
            if: (props) => props.message.source.type === 'media',
        });
    }
}
