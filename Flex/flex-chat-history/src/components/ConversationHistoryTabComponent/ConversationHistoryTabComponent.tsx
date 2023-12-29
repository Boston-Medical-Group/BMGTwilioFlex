import React, { useEffect, useState, useCallback } from 'react';
import * as Flex from '@twilio/flex-ui';
import { ITask, Icon, NotificationType, NotificationContentProps } from '@twilio/flex-ui';
import { fetchConversationsByParticipant } from '../../helpers/fetchConversationsAndMessages';
import { Disclosure, DisclosureHeading, DisclosureContent } from '@twilio-paste/core/disclosure';
import { Box } from '@twilio-paste/core/box';
import ConversationHistoryTranscriptComponent from '../ConversationHistoryTranscriptComponent/ConversationHistoryTranscriptComponent';
import { Text } from '@twilio-paste/core';

interface CustomNotificationProps extends NotificationContentProps {
    customProp?: string;
    notificationContext?: any;
}

const CustomNotificationElement = ({ notificationContext }: CustomNotificationProps = {}) => {
    return (
        <div>
            {notificationContext.message}
        </div>
    );
}

type MyProps = {
    label: string;
    task?: ITask;
    manager: Flex.Manager;
};

type ConversationTrimmed = {
    conversationSid: string,
    conversationDateCreated: string,
    conversationOriginalChannel: string,
    conversationState: string
}

const ConversationHistoryTabComponent = ({ task, manager } : MyProps) => {

    const [conversations, setConversations] = useState<ConversationTrimmed[]>([])
    const [phoneNumber, setPhoneNumber] = useState<string>('')

    useEffect(() => {
        registerNotification();

        if (phoneNumber != task?.attributes.from) {
            fetchConversationsByParticipant(manager, task?.attributes.from)
                .then((convos) => {
                    setConversations(convos)
                    setPhoneNumber(task?.attributes.from)
                })
                .catch(() => {
                    Flex.Notifications.showNotification("loadConversations", { message: "No hemos podido cargar el historial de mensajes" });
                })
        }
    }, [phoneNumber, task])

    const registerNotification = useCallback(() => {
        Flex.Notifications.registerNotification({
            id: "loadConversations",
            content: <CustomNotificationElement />,
            closeButton: true,
            type: NotificationType.error,
        });
    }, [])

    return (
        <Box padding="space20" width="100vw">
            {
                conversations?.map((conversation, index) => {
                    const dateTime: string = conversation.conversationDateCreated;
                    if (conversation.conversationSid == task?.attributes.conversationSid) {
                        return;
                    }
                    //define the icon based on the channel
                    let channelIcon;
                    switch (conversation.conversationOriginalChannel) {
                        case 'whatsapp':
                            channelIcon = <Icon icon="Whatsapp" />;
                            break;
                        case 'sms':
                            channelIcon = <Icon icon="Sms" />;
                            break;
                        default:
                            channelIcon = <Icon icon="Message" />;
                    }
                    return (
                        <Disclosure key={conversation.conversationSid}>
                            <DisclosureHeading as="h2" variant="heading50" key={conversation.conversationSid}>
                                {channelIcon}{dateTime.slice(0, 24)} <Text color="colorTextWeak" fontSize="fontSize20" marginRight="space30" as="span"> ({conversation.conversationState})</Text>
                            </DisclosureHeading>
                            <DisclosureContent key={index}>
                                <ConversationHistoryTranscriptComponent conversationSid={conversation.conversationSid} manager={manager} />
                            </DisclosureContent>
                        </Disclosure>
                    )
                })
            }
        </Box>
    );
}

export default ConversationHistoryTabComponent;