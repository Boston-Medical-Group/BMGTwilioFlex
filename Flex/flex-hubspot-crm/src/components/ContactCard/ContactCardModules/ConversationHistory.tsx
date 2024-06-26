import React, { useEffect, useCallback, useState } from 'react';
import * as Flex from "@twilio/flex-ui";
import { Notifications, NotificationIds, NotificationType } from "@twilio/flex-ui";
import { Box, SkeletonLoader, Stack, Text } from '@twilio-paste/core';
import ConversationHistoryEntry from './ConversationHistory/ConversationHistoryEntry';
import { HubspotContact } from '../../../Types';
import useLang from '../../../hooks/useLang';

const loadConversations = (contact: HubspotContact, currentConversation : string, manager : Flex.Manager) => {
    const phone = contact.phone

    return fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/crm/getConversations`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            skipSid: currentConversation,
            phone,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        })
    })
        .then((resp) => resp.json());
}

type Props = {
    contact: HubspotContact
    manager: Flex.Manager
    currentConversation: string
}

const ConversationHistory = ({ contact, manager, currentConversation } : Props) => {
    const { _l } = useLang();
    const [loaded, setLoaded] = useState(false);
    const [conversations, setConversations] = useState([])

    useEffect(() => {
        loadConversations(contact, currentConversation, manager)
            .then((conversations) => {
                if (!conversations.hasOwnProperty('error')) {
                    setConversations(conversations)
                } else {
                    
                    Notifications.showNotification('errorLoadingConversations');
                }
                
                setLoaded(true)
            })
    }, [])

    return (
        <Box>
            {!loaded && <SkeletonLoader height="150px" />}
            {loaded && (
                <Stack orientation="vertical" spacing="space50">
                    {conversations.length > 0 && conversations.map((conversation, index) => (
                        <ConversationHistoryEntry key={index} conversation={conversation} manager={manager} />
                    ))}

                    {conversations.length === 0 && (
                        <Box padding="space40">
                            <Text as="p" textAlign="center">{_l('No conversations found')}</Text>
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
    )
}

export default ConversationHistory