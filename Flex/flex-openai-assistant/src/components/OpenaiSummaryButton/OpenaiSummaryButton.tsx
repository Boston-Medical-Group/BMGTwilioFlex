import * as Flex from "@twilio/flex-ui"
import { Button, Spinner, Box, Text, Paragraph } from "@twilio-paste/core"
import { useState } from "react"
import { useDispatch } from 'react-redux';
import useApi from "../../hooks/useApi"
import { actions } from '../../states';

type MyProps = {
    task: Flex.ITask
    manager: Flex.Manager
}

export const OpenaiSummaryButton = ({ manager, task }: MyProps) => {
    
    const dispatch = useDispatch();
    const { fetchOpenAIResponse } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

    const [showSpinner, setShowSpinner] = useState(false)
    const conversationSid = task.attributes.conversationSid ?? task.attributes.channelSid;

    const handleIAGenerate = async () => {
        setShowSpinner(true)
        try {
            const summary = await fetchOpenAIResponse(conversationSid, 'summary');

            const newSummaryText = "Resumen (AI): " + summary;

            dispatch(actions.summaryMessage.setSummary(newSummaryText));

            // Disable the button after a successful API call
            setShowSpinner(false)

        } catch (error) {
            console.error('Error summarizing message:', error);
            setShowSpinner(false)
        }
    }

    return (
        <Box marginRight="space30">
            <Button variant="secondary" disabled={showSpinner} onClick={handleIAGenerate}>
                <Text as="span">Resumen AI</Text>
                {showSpinner &&
                    <Spinner decorative={false} title="Loading" />}
            </Button>
        </Box>
    );
}

