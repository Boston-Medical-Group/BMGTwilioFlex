import React, { useCallback, useEffect, useState } from 'react';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import SummaryContent from './Summary/SummaryContent';
import GPTReplyModal from './Summary/GPTReplyModal'

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const Summary = ({ manager, task }) => {
    
    //const [conversationSid, setConversationSid] = useState();
    //const [channelSid] = useState(task.attributes?.taskChannelSid)
    const [summary, setSummary] = useState({});
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showButtons, setShowButtons] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    useEffect(async () => {
        setLoaded(false)
        let csid = task.attributes?.conversationSid ?? false
        console.log('CSID', csid)
        if (csid) {
            await reloadSummary(csid, false).finally(() => {

                const roles = manager?.store?.getState()?.flex?.session?.ssoTokenPayload?.roles ?? []
                const skills = manager?.workerClient?.attributes?.routing?.skills ?? []

                setShowButtons(roles.indexOf('admin') >= 0 || skills?.indexOf('IA_Assistant') >= 0)
                setLoaded(true)
            })
        }
    }, [task])

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

    const reloadSummary = useCallback(async (conversationSid, force) => {
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
    }, [])

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
                conversationSid={task.attributes.conversationSid} messagesCount={summary.messagesCount} />
            <SummaryContent conversationSid={task.attributes.conversationSid} reloadAction={reloadSummary} suggestAction={suggestReply} summary={summary} loading={loading} manager={manager} withoutButtons={!showButtons} />
        </>
    );
};

export default Summary