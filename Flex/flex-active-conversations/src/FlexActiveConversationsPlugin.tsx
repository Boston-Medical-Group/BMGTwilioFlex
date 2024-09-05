import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import { Notifications, NotificationType } from '@twilio/flex-ui'

import ActiveConversationsList from './components/ActiveConversationsList/ActiveConversationsList';
import ActiveConversationsLink from './components/ActiveConversationsLink';

const PLUGIN_NAME = 'FlexActiveConversationsPlugin';

const registerNotifications = () => {
  if (!Notifications.registeredNotifications.has('errorLoadingConversations')) {
    Flex.Notifications.registerNotification({
      id: "errorLoadingConversations",
      content: "Error al cargar las conversaciones",
      type: Flex.NotificationType.error
    });
  }
}

export default class FlexActiveConversations2Plugin extends FlexPlugin {
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
    const userRoles = manager?.store?.getState()?.flex?.session?.ssoTokenPayload?.roles || [];

    registerNotifications();

    Flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    });

    const options: Flex.ContentFragmentProps = {
      sortOrder: -1,
      if: () => userRoles.indexOf('admin') >= 0 || userRoles.indexOf('supervisor') >= 0
    };
    
    flex.ViewCollection.Content.add(
      <Flex.View name="active-conversations" key="FlexActiveConversationsPlugin-component">
        <ActiveConversationsList manager={manager} />
      </Flex.View>, options);
    
    flex.SideNav.Content.add(<ActiveConversationsLink key="FlexActiveConversationsPlugin-link" flex={flex} icon="IncomingCall" />, {
      if: () => userRoles.indexOf('admin') >= 0 || userRoles.indexOf('supervisor') >= 0,
      sortOrder: 5,
    });
  }
}
