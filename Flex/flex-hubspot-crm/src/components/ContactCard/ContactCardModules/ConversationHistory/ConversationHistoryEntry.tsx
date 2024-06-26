import * as Flex from "@twilio/flex-ui";
import {
    Disclosure, DisclosureHeading, DisclosureContent, useDisclosureState,
    ChatLog, ChatMessage, ChatBubble, ChatAttachment, ChatAttachmentLink, ChatAttachmentDescription, ChatMessageMeta, ChatMessageMetaItem,
    ChatEvent, ChatBookend, ChatBookendItem
} from "@twilio-paste/core"
import { Icon, Notifications } from "@twilio/flex-ui";
import { Key, useEffect, useState } from "react";
import SummaryContent from "../Summary/SummaryContent";
import useLang from "../../../../hooks/useLang";

const getConversationLog = async (sid : string, manager : Flex.Manager) => {
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

type DisclosureState = {
    conversation: any,
    manager: Flex.Manager
}
const useDelayedDisclosureState = ({ conversation, manager, ...initialState } : DisclosureState) => {
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

type ChannelTitleProps = {
    icon: string
    title: string
}

const ChannelTitle = ({ icon, title } : ChannelTitleProps) => {
    return (
        <>
            <Icon icon={icon} /> 
            {title}
        </>
    )
}

type Props = { 
    conversation: any,
    manager: Flex.Manager
}

const ConversationHistoryEntry = ({ conversation, manager }: Props) => {
    const { _l } = useLang()
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
                {transitioning ? _l('Please wait...') : <ChannelTitle icon={channelIcon} title={conversation.conversationDateCreated} />}
            </DisclosureHeading>
            <DisclosureContent>

                {conversationSummary && (
                    <SummaryContent summary={{ content: conversationSummary }} withoutButtons={true} reloadAction={() => { }} suggestAction={() => { }} />
                )}

                <ChatLog>
                    {conversationLog.length === 0 && (
                        <ChatEvent>
                            <strong>{_l('No messages in the conversation')}</strong>
                        </ChatEvent>
                    )}
                    
                    {conversationLog.length > 0 && (
                        <ChatEvent>
                            <strong>{_l('Conversation start')}</strong>
                        </ChatEvent>
                    )}
                    {conversationLog.map((message : any, index) => {
                        let dateTime = message.dateCreated;
                        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
                        if (message.author.startsWith("whatsapp:") || message.author.startsWith("+") || uuidPattern.test(message.author) || message.author === 'Virtual Assistant') {
                            return (
                                <ChatMessage variant="inbound" key={message.index}>
                                    <ChatBubble >{message.body}</ChatBubble>
                                    {
                                        message.media?.map((media : any, index : any) => {
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
                            return (
                                <ChatMessage variant="outbound" key={message.index}>
                                    <ChatBubble >{message.body}</ChatBubble>
                                    {
                                        message.media?.map((media : any, index : any) => {
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
                                <strong>{_l('Conversation end')}</strong>
                            </ChatBookendItem>
                        </ChatBookend>
                    )}
                </ChatLog>
            </DisclosureContent>
        </Disclosure>
    )
}

export default ConversationHistoryEntry