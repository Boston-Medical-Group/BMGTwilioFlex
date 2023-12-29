import React, { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { ITask, Icon } from '@twilio/flex-ui';
import { fetchConversationMessages } from '../../helpers/fetchConversationsAndMessages';
import {
    ChatLog,
    ChatMessage,
    ChatMessageMeta,
    ChatMessageMetaItem,
    ChatBubble,
    ChatAttachment,
    ChatAttachmentLink,
    ChatAttachmentDescription
} from '@twilio-paste/core/chat-log';

type MyProps = {
    task?: ITask;
    conversationSid: string;
    manager: Flex.Manager;
};

type MessageTrimmed = {
    index: string,
    author: string,
    body: string,
    media: any,
    dateCreated: string
}

type Media = {
    filename: string,
    content_type: string,
    size: BigInteger;
}

const ConversationHistoryTranscriptComponent = ({ manager, conversationSid }: MyProps) => {

    const [messages, setMessages] = useState<MessageTrimmed[]>([]);


    useEffect(() => {
        async function cFetchConversationMessages() {
            await fetchConversationMessages(manager, conversationSid)
                .then((msgs) => {
                    setMessages(msgs)
                })
        }

        cFetchConversationMessages()
    }, [])

    return (
        <ChatLog>
            {
                messages?.map((message) => {
                    const dateTime: string = message.dateCreated;
                    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
                    if (message.author.startsWith("whatsapp:") || message.author.startsWith("+") || uuidPattern.test(message.author) || message.author === 'Virtual Assistant') {
                        return (
                            <ChatMessage variant="inbound" key={message.index}>
                                <ChatBubble >{message.body}</ChatBubble>
                                {
                                    message.media?.map((media: Media, index: React.Key) => {
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
                    }
                    else {
                        let author = message.author;
                        if (author === conversationSid) {
                            author = "Virtual Agent";
                        }
                        return (
                            <ChatMessage variant="outbound" key={message.index}>
                                <ChatBubble >{message.body}</ChatBubble>
                                {
                                    message.media?.map((media: Media, index: React.Key) => {
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
                })
            }
        </ChatLog>
    );
}

export default ConversationHistoryTranscriptComponent;