import React from "react";
import { Box } from "@twilio-paste/core";
import * as Flex from "@twilio/flex-ui";
import { DefaultFilterGroup } from "./DefaultFilterGroup";

type Props = {
    manager: Flex.Manager
}

const GeoPermissionsView = ({ manager }: Props) => {
    //const [accountCountry] = useState(manager.serviceConfiguration.attributes.account_country);
    return (
        <Box padding="space40" height="100%" overflow="auto" width={"100%"}>
            <DefaultFilterGroup />
        </Box>
    )
}

export default GeoPermissionsView;