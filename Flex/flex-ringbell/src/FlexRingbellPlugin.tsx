import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import { Reservation } from 'twilio-taskrouter';
const PLUGIN_NAME = 'FlexRingbellPlugin';

export default class FlexRingbellPlugin extends FlexPlugin {
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
    
    // play rining sounds when call incoming
    const incoming_voice = new Audio('//media.twiliocdn.com/sdk/js/client/sounds/releases/1.0.0/incoming.mp3');
    const incoming_message = new Audio('//media.twiliocdn.com/sdk/js/client/sounds/releases/1.0.0/incoming.mp3');
    incoming_voice.loop = true;
    incoming_message.loop = false;

    const workerClient = manager.workerClient;
    if (workerClient) {
      manager.workerClient.on("reservationCreated", function (reservation: Reservation) {
        if (reservation.task.taskChannelUniqueName === 'voice' &&
          reservation.task.attributes.direction === 'inbound'
        ) {
          incoming_voice.play();
        } else if (reservation.task.taskChannelUniqueName === 'sms' ||
          reservation.task.taskChannelUniqueName === 'chat'
        ) {
          incoming_message.play();
        }

        ['accepted', 'rejected', 'timeout', 'canceled', 'rescinded'].forEach((event) => {
          reservation.on(event, () => {
            incoming_voice.pause();
            incoming_message.pause();
          })
        })
      });
    }


  }
}
