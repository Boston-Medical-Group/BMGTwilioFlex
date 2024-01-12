import * as Flex from '@twilio/flex-ui';

import WhatsAppTemplatesDropdown from '../../components/WhatsAppTemplatesDropdown';

export default function addWhatsAppTemplatesDropdownToMessageInputActions(
    flex: typeof Flex,
    _manager: Flex.Manager,
) {
    const UILocation = process.env.COMPONENT_UI_LOCATION || '<COMPONENT_UI_LOCATION>';
    const options: Flex.ContentFragmentProps = {
        sortOrder: 4,
    };
    console.log('UILOCATION', UILocation)
    //if (UILocation !== 'MessageInputActions') {
        flex.MessageInputActions.Content.add(<WhatsAppTemplatesDropdown manager={_manager} key="whtasapp-templates-dropdown-button" />, options);
    //}
};