import * as Flex from '@twilio/flex-ui';
import { FlexEvent } from '../../types/FlexEvent';

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  console.log(`Feature enabled: callback-and-voicemail`);
};

export default pluginsLoadedHandler;
