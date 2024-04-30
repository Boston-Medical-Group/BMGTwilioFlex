import { View } from '@twilio/flex-ui';

import InboundConfigsView from '../components/InboundConfigsView';
import { hasAdminRights } from '../helpers';

export const initializeInboundConfigs = (flex, manager) => {
    flex.ViewCollection.Content.add(
        <View name="inboundconfigs-view" key="inboundconfigs-view">
            <InboundConfigsView key="inboundconfigs-viewcontent" manager={manager} />
        </View>,
        {
            if: hasAdminRights,
        },
    );
}