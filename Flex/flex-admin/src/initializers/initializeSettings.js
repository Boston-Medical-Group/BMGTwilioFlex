import { View } from '@twilio/flex-ui';

import { hasAdminRights } from '../helpers';
import SettingsView from '../components/SettingsView';
import SettingsLink from '../components/SettingsLink';

export const initializeSettings = (flex, manager) => {
    flex.ViewCollection.Content.add(
        <View name="settings-view" key="settings-view">
            <SettingsView key="settings-viewcontent" manager={manager} />
        </View>,
        {
            if: hasAdminRights,
        },
    );

    flex.SideNav.Content.add(<SettingsLink key="settings-link" flex={flex} />, {
        if: hasAdminRights,
        sortOrder: 5,
    });
}