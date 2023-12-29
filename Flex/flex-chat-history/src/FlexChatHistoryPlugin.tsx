import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import { FlexPlugin } from '@twilio/flex-plugin';
import ConversationHistoryTabComponent from './components/ConversationHistoryTabComponent/ConversationHistoryTabComponent';
import { addParticipantToConversation } from './helpers/addParticipantToConversation';

const PLUGIN_NAME = 'FlexChatHistoryPlugin';

export default class FlexChatHistoryPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex: typeof Flex, manager: Flex.Manager) {
    const options: Flex.ContentFragmentProps = { sortOrder: -1 };

    Flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    });

    flex.TaskCanvasTabs.Content.add(<ConversationHistoryTabComponent key="data-on-canvas-comp" label="Conversations" manager={manager} />);

    flex.Actions.replaceAction('WrapupTask', async (payload, original) => {
      // Only alter chat tasks, skip others
      if (payload.task.taskChannelUniqueName !== "chat" || payload.task.attributes.from.startsWith('whatsapp:')) {
        original(payload);
      } else {
        await addParticipantToConversation(manager, payload.task.attributes.conversationSid, payload.task.attributes.from);
        return new Promise(function (resolve, reject) {
          resolve(original(payload));
        })
      }
    });
  }
}
