import { Box, ChatAttachment, ChatAttachmentDescription, ChatAttachmentLink, ChatBookend, ChatBookendItem, ChatBubble, ChatEvent, ChatLog, ChatMessage, ChatMessageMeta, ChatMessageMetaItem, Spinner } from '@twilio-paste/core'
import * as Flex from '@twilio/flex-ui'
import { Icon } from '@twilio/flex-ui'
import { useEffect, useState } from 'react'
import useLang from '../../hooks/useLang'

type Props = {
    manager: Flex.Manager
    conversationSid: string
}

Flex.Notifications.registerNotification({
    id: "errorLoadingConversations",
    content: "Error al cargar las conversaciones",
    type: Flex.NotificationType.error
});

const getConversationLog = async (sid: string, manager: Flex.Manager) => {
    return fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/crm/getConversationMessages`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            conversationSid: sid,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        })
    })
        .then((resp) => resp.json());
}

const ConversationTranscription = ({ conversationSid, manager }: Props) => { 

    const { _l } = useLang();

    const [conversationLog, setConversationLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getConversationLog(conversationSid, manager)
            .then((conversationMessages) => {
                if (!conversationMessages.hasOwnProperty('error')) {
                    setConversationLog(conversationMessages.log);
                } else {
                    Flex.Notifications.showNotification('errorLoadingConversationMessages');
                }
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [])

    return (
        
        <ChatLog>
            {isLoading && (
                <ChatEvent>
                    <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
                        <Spinner decorative={false} title="Loading" size="sizeIcon30" />
                        <strong>{_l('Loading conversation')}</strong>
                    </Box>
                </ChatEvent>
            )}

            {!isLoading && conversationLog.length === 0 && (
                <ChatEvent>
                    <strong>{_l('No messages in the conversation')}</strong>
                </ChatEvent>
            )}

            {!isLoading && conversationLog.length > 0 && (
                <ChatEvent>
                    <strong>{_l('Conversation start')}</strong>
                </ChatEvent>
            )}
            {!isLoading && conversationLog.map((message: any, index) => {
                let dateTime = message.dateCreated;
                const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
                if (message.author.startsWith("whatsapp:") || message.author.startsWith("+") || uuidPattern.test(message.author) || message.author === 'Virtual Assistant') {
                    return (
                        <ChatMessage variant="inbound" key={message.index}>
                            <ChatBubble >{message.body}</ChatBubble>
                            {
                                message.media?.map((media: any, index: any) => {
                                    if (!media) {
                                        return;
                                    }
                                    let filename = media.filename;
                                    let content_type = media.content_type;
                                    if (!filename) {
                                        filename = 'undefined';
                                    }
                                    if (!content_type) {
                                        content_type = 'undefined';
                                    }
                                    return (
                                        <ChatBubble key={index}>
                                            
                                            <ChatAttachment attachmentIcon={<Icon icon="Whatsapp" />} >
                                                <ChatAttachmentLink href='#'>{filename}</ChatAttachmentLink>
                                                <ChatAttachmentDescription>{content_type}</ChatAttachmentDescription>
                                            </ChatAttachment>
                                        </ChatBubble>
                                    )
                                })
                            }
                            <ChatMessageMeta aria-label="customer" >
                                <ChatMessageMetaItem>{message.author} ・ {dateTime.slice(0, 24)}</ChatMessageMetaItem>
                            </ChatMessageMeta>
                        </ChatMessage>
                    )
                } else {
                    let author = message.author;
                    if (author === conversationSid) {
                        author = "Virtual Agent";
                    }
                    return (
                        <ChatMessage variant="outbound" key={message.index}>
                            <ChatBubble >{message.body}</ChatBubble>
                            {
                                message.media?.map((media: any, index: any) => {
                                    if (!media) {
                                        return;
                                    }
                                    let filename = media.filename;
                                    let content_type = media.content_type;
                                    if (!filename) {
                                        filename = 'undefined';
                                    }
                                    if (!content_type) {
                                        content_type = 'undefined';
                                    }
                                    return (
                                        <ChatBubble key={index}>
                                            <ChatAttachment attachmentIcon={<Icon icon="Whatsapp" />}>
                                                <ChatAttachmentLink href='#'>{filename}</ChatAttachmentLink>
                                                <ChatAttachmentDescription>{content_type}</ChatAttachmentDescription>
                                            </ChatAttachment>
                                        </ChatBubble>
                                    )
                                })
                            }
                            <ChatMessageMeta aria-label="agent" >
                                <ChatMessageMetaItem>{author} ・ {dateTime.slice(0, 24)}</ChatMessageMetaItem>
                            </ChatMessageMeta>
                        </ChatMessage>
                    )
                }
            })}

            {!isLoading && conversationLog.length > 0 && (
                <ChatBookend>
                    <ChatBookendItem>
                        <strong>{_l('Conversation end')}</strong>
                    </ChatBookendItem>
                </ChatBookend>
            )}
        </ChatLog>
    )
}

export default ConversationTranscription