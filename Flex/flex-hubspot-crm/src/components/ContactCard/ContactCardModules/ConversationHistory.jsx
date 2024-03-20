import React, { useEffect, useCallback, useState } from 'react';
import { Notifications, NotificationIds, NotificationType } from "@twilio/flex-ui";
import { Box, SkeletonLoader, Stack } from '@twilio-paste/core';
import ConversationHistoryEntry from './ConversationHistory/ConversationHistoryEntry';

const loadConversations = (contact, currentConversation, manager) => {
    const phone = contact.phone

    return fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/crm/getConversations`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
            skipSid: currentConversation,
            phone,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        })
    })
        .then((resp) => resp.json());
}

const registerNotifications = () => {
    Notifications.registerNotification({
        id: "errorLoadingConversations",
        content: "Error al cargar las conversaciones",
        type: NotificationType.error
    });
}


const ConversationHistory = ({ contact, manager, currentConversation }) => {
    
    const [loaded, setLoaded] = useState(false);
    const [conversations, setConversations] = useState([])

    useEffect(() => {
        registerNotifications()
    }, [])

    useEffect(async () => {
        await loadConversations(contact, currentConversation, manager)
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
                    {conversations.map((conversation, index) => (
                        <ConversationHistoryEntry key={index} conversation={conversation} manager={manager} />
                    ))}
                </Stack>
            )}
        </Box>
    )
}

export default ConversationHistory