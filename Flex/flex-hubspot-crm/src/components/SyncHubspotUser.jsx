import { useEffect, useState } from "react";
import * as Flex from "@twilio/flex-ui";
import useApi from "../hooks/useApi";

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 *
 * @param { Flex.Manager } manager - an object representing the task manager
 * @return { JSX.Element | null } - the rendered JSX element or null if isOpen is false
 */
const SyncHubspotUser = ({ manager }) => {
    const { getHubspotUserByEmail } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

    useEffect(async () => {
        await sync();
    }, [])

    const sync = async () => {
        if (!manager.workerClient.attributes.hasOwnProperty('hubspot_id') || !manager.workerClient.attributes.hasOwnProperty('hubspot_owner_id')) {
            getHubspotUserByEmail({ email: manager.workerClient.attributes.email })
                .then(async (users) => {
                    if (users?.results && users.results[0]) {
                        const user = users.results[0];
                        if (user) {
                            if (user.userId) {
                                manager.workerClient.attributes.hubspot_id = user.userId;
                            }
                            if (user.id) {
                                manager.workerClient.attributes.hubspot_owner_id = user.id;
                            }
                            
                            console.log(manager.workerClient.attributes);
                            await manager.workerClient.setAttributes(manager.workerClient.attributes);
                        }
                    }
                })
                .catch(() => console.log("Error while Syncing Hubspot User"));
        }
    }

    return null;
};

export default SyncHubspotUser;