import { View } from '@twilio/flex-ui';

import DowntimeManagerView from '../components/DowntimeManagerView';
import { hasAdminRights } from '../helpers';

const { REACT_APP_DOWNTIME_MANAGER_VIEW_NAME } = process.env;

export const initializeDowntimeManager = (flex, manager) => {
  flex.ViewCollection.Content.add(
    <View name="downtime-manager-view" key="downtime-manager-view">
      <DowntimeManagerView key="downtime-manager-viewcontent" />
    </View>,
    {
      if: hasAdminRights,
    },
  );
};