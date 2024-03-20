import React, { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { Box, Heading, DetailText, ButtonGroup, Button, Stack } from '@twilio-paste/core';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import SummaryContent from './Summary/SummaryContent';
import GPTReplyModal from './Summary/GPTReplyModal'

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const Summary = ({ manager, task }) => {
    
    const [conversationSid] = useState(task.attributes?.conversationSid);
    const [channelSid] = useState(task.attributes?.taskChannelSid)
    const [summary, setSummary] = useState({});
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    useEffect(async () => {
        if (conversationSid) {
            await reloadSummary(false)
        }
        setLoaded(true)
    }, [conversationSid])

    const suggestReply = async () => {
        handleModalOpen();

        /*
        Flex.Actions.invokeAction('SetInputText', {
            body: 'TEST',
            conversationSid,
            selectionStart: 5,
            selectionEnd: 5,
        });
        */

        /*
        const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/crm/getReplySuggestion`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationSid,
                Token: manager.store.getState().flex.session.ssoTokenPayload.token
            })
        });*/
    }

    const reloadSummary = async (force) => {
        setLoading(true)
        const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/crm/getConversationSummary`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationSid,
                force,
                Token: manager.store.getState().flex.session.ssoTokenPayload.token
            })
        });

        setSummary(await request.json())
        setLoading(false)
    }

    if (!loaded) {
        return (
            <>
                <SkeletonLoader height="150px" />
            </>
        )
    }

    if (!summary.hasOwnProperty('content')) {
        return <></>
    }

    return (
        <>
            <GPTReplyModal manager={manager} isOpen={isModalOpen} handleClose={handleModalClose}
                conversationSid={conversationSid} channelSid={channelSid}  messagesCount={summary.messagesCount} />
            <SummaryContent reloadAction={reloadSummary} suggestAction={suggestReply} summary={summary} loading={loading} manager={manager} />
        </>
    );
};

export default Summary