import { View } from '@twilio/flex-ui';

import DoNotCallView from '../components/DoNotCallView';
import { hasAdminRights } from '../helpers';

export const initializeDonotcall = (flex, manager) => {
    flex.ViewCollection.Content.add(
        <View name="donotcall-view" key="donotcall-view">
            <DoNotCallView key="donotcall-viewcontent" manager={manager} />
        </View>,
        {
            if: hasAdminRights,
        },
    );
}