import {
    Disclosure, DisclosureHeading, DisclosureContent, useDisclosureState,
    ChatLog, ChatMessage, ChatBubble, ChatAttachment, ChatAttachmentLink, ChatAttachmentDescription, ChatMessageMeta, ChatMessageMetaItem,
    ChatEvent, ChatBookend, ChatBookendItem
} from "@twilio-paste/core"
import { Icon, Notifications } from "@twilio/flex-ui";
import { useEffect, useState } from "react";
import SummaryContent from "../Summary/SummaryContent";

const getConversationLog = async (sid, manager) => {
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

const useDelayedDisclosureState = ({ conversation, manager, ...initialState }) => {
    const disclosure = useDisclosureState(initialState);
    const [transitioning, setTransitioning] = useState(false);
    const [conversationLog, setConversationLog] = useState([]);
    const [conversationSummary, setConversationSummary] = useState('');
    
    return {
        ...disclosure,
        transitioning,
        conversationLog,
        conversationSummary,
        toggle: async () => {
            setTransitioning(true);
            if (conversationLog.length !== 0) {
                disclosure.toggle();
                setTransitioning(false);
            } else {
                getConversationLog(conversation.conversationSid, manager)
                    .then((conversationMessages) => {
                        if (!conversationMessages.hasOwnProperty('error')) {
                            setConversationLog(conversationMessages.log);
                            if (conversationMessages.summary) {
                                setConversationSummary(conversationMessages.summary);
                            }
                            disclosure.toggle();
                            setTransitioning(false);
                        } else {
                            Notifications.showNotification('errorLoadingConversationMessages');
                        }
                    })
            }

        },
    };
};

const ChannelTitle = ({ icon, title }) => {
    return (
        <>
            <Icon icon={icon} /> 
            {title}
        </>
    )
}

const ConversationHistoryEntry = ({ conversation, manager }) => {
    const { transitioning, conversationLog, conversationSummary, ...disclosure } = useDelayedDisclosureState({
        conversation,
        manager
    });
    const [channelIcon, setChannelIcon] = useState('Message')

    useEffect(() => {
        switch (conversation.conversationOriginalChannel) {
            case 'whatsapp':
                setChannelIcon('Whatsapp')
                break;
            case 'sms':
                setChannelIcon('Sms')
                break;
            default:
                setChannelIcon('Message')
        }
    }, [])

    return (
        <Disclosure variant="contained" state={disclosure} key={conversation.conversationSid}>
            <DisclosureHeading as="h2" variant="heading40">
                {transitioning ? 'Por favor espere...' : <ChannelTitle icon={channelIcon} title={conversation.conversationDateCreated} />}
            </DisclosureHeading>
            <DisclosureContent>

                {conversationSummary && (
                    <SummaryContent summary={{content: conversationSummary}} withoutButtons={true} />
                )}

                <ChatLog>
                    {conversationLog.length === 0 && (
                        <ChatEvent>
                            <strong>No hay mensajes en la conversación</strong>
                        </ChatEvent>
                    )}
                    
                    {conversationLog.length > 0 && (
                        <ChatEvent>
                            <strong>Inicio de la conversación</strong>
                        </ChatEvent>
                    )}
                    {conversationLog.map((message, index) => {
                        let dateTime = message.dateCreated;
                        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
                        if (message.author.startsWith("whatsapp:") || message.author.startsWith("+") || uuidPattern.test(message.author) || message.author === 'Virtual Assistant') {
                            return (
                                <ChatMessage variant="inbound" key={message.index}>
                                    <ChatBubble >{message.body}</ChatBubble>
                                    {
                                        message.media?.map((media, index) => {
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
                            if (author === conversation.conversationSid) {
                                author = "Virtual Agent";
                            }
                            //console.log("outbound message?", message)
                            return (
                                <ChatMessage variant="outbound" key={message.index}>
                                    <ChatBubble >{message.body}</ChatBubble>
                                    {
                                        message.media?.map((media, index) => {
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

                    {conversationLog.length > 0 && (
                        <ChatBookend>
                            <ChatBookendItem>
                                <strong>Fin de la conversación</strong>
                            </ChatBookendItem>
                        </ChatBookend>
                    )}
                </ChatLog>
            </DisclosureContent>
        </Disclosure>
    )
}

export default ConversationHistoryEntry