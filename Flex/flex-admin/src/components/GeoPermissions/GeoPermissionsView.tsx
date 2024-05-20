import React, { useState } from "react";
import { Theme } from '@twilio-paste/core/dist/theme';
import { Flex as FlexView, Box } from "@twilio-paste/core";
import * as Flex from "@twilio/flex-ui";
import { DefaultFilterGroup } from "./DefaultFilterGroup";

type Props = {
    manager: Flex.Manager
}

const GeoPermissionsView = ({ manager }: Props) => {
    const [accountCountry] = useState(manager.serviceConfiguration.attributes.account_country);
    return (
        <Theme.Provider theme="flex">
            {/* <FlexView>Pais {accountCountry}</FlexView> */}
            <Box padding="space40" height="95%" overflow="auto">
                <DefaultFilterGroup />
            </Box>
        </Theme.Provider>
    )
}

export default GeoPermissionsView;