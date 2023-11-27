import { View } from '@twilio/flex-ui';

import WrapupCodes from '../components/WrapupCodes';
import { hasAdminRights } from '../helpers';

export const initializeWrapupCodes = (flex, manager) => {
    flex.ViewCollection.Content.add(
        <View name="wrapupcodes-view" key="wrapupcodes-view">
            <WrapupCodes key="wrapupcodes-viewcontent" manager={manager} />
        </View>,
        {
            if: hasAdminRights,
        },
    );
}