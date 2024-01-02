import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui'
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization'
import axios from 'axios'

import { CalendarButton } from './components';

const PLUGIN_NAME = 'FlexQuickScheduleButtonPlugin';

export default class FlexQuickScheduleButtonPlugin extends FlexPlugin {
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
    const options: Flex.ContentFragmentProps = { sortOrder: -1 };
    
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    })

    flex.TaskCanvasHeader.Content.add(
      <CalendarButton key='calendar-button-interaction' manager={manager} />,
      {
        sortOrder: 1,
        if: (props: { task: ITask }) => props.task.attributes.contact_id !== '' || props.task.attributes.deal_id !== ''
          
      }
    )
  }
}
