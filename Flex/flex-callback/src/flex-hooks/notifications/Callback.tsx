import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/Callback';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum CallbackNotification {
  OutboundDialingNotEnabled = 'CallbackOutboundDialingNotEnabled',
  ErrorCallBackAndVoicemail = 'ErrorCallBackAndVoicemail',
}


export default (flex: typeof Flex, manager: Flex.Manager) => {
  //errorNotification(flex, manager);
  //outboundDialingNotEnabled(flex, manager);
};
