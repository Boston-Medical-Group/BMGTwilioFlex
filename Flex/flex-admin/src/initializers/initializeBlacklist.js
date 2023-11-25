import { View } from '@twilio/flex-ui';

import BlacklistView from '../components/BlacklistView';
import { hasAdminRights } from '../helpers';

export const initializeBlacklist = (flex, manager) => {
    flex.ViewCollection.Content.add(
        <View name="blacklist-view" key="blacklist-view">
            <BlacklistView key="blacklist-viewcontent" manager={manager}/>
        </View>,
        {
            if: hasAdminRights,
        },
    );
}