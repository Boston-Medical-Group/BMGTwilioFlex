import { View } from '@twilio/flex-ui';

import GeoPermissionsView from '../components/GeoPermissions/GeoPermissionsView';
import { hasAdminRights } from '../helpers';

export const initializeGeoPermissions = (flex, manager) => {
    flex.ViewCollection.Content.add(
        <View name="geopermissions-view" key="geopermissions-view">
            <GeoPermissionsView key="geopermissions-viewcontent" manager={manager} />
        </View>,
        {
            if: hasAdminRights,
        },
    );
}