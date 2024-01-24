import * as Flex from "@twilio/flex-ui"
import { Button, Spinner, Box } from "@twilio-paste/core"
import { NewIcon } from "@twilio-paste/icons/esm/NewIcon"
import { useCallback, useState, useEffect, useRef } from "react"
import useApi from "../../hooks/useApi"
import OpenAI from "openai"

type MyProps = {
    task: Flex.ITask
    manager: Flex.Manager
}

type RunData = {
    thread_id: string
    run_id: string
}
type RunResult = {} & OpenAI.Beta.Threads.Runs.Run

export const OpenaiAssistantButton = ({ task, manager }: MyProps) => {

    const { createRun, getRunStatus } = useApi({ token: process.env.FLEX_APP_TWILIO_SERVERLESS_TOKEN as string });

    const [isLoading, setIsLoading] = useState(false);
    const [pollCounter, setPollCounter] = useState(0)
    const timerIdRef = useRef<string | number | undefined | NodeJS.Timeout>();
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);
    const [runData, setRunData] = useState<null | RunData>(null)
    const [message, setMessage] = useState('')
    const conversationSid = task.attributes.conversationSid ?? task.attributes.channelSid;
    const inputState = Flex.useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid]?.inputText);

    const handleIAGenerate = useCallback(async () => {
        setIsLoading(true);

        await createRun({
            conversation_sid: conversationSid
        }).then(async (run: RunResult) => {
            if (run.id) {
                setRunData({
                    thread_id: run.thread_id,
                    run_id: run.id
                })
            }
        })
    }, [])

    useEffect(() => {
        const pollingCallback = async () => {
            await getRunStatus(runData)
                .then((message: { code: string, body: string | null }) => {
                    if (message.code === "SUCCESS" && message.body !== null) {
                        setPollCounter(0)
                        setRunData(null)
                        setMessage(message.body)
                    } else if (message.code === "NOT_FOUND" || message.code === "NOT_TEXT") {
                        setPollCounter(0)
                        setRunData(null)
                        setIsPollingEnabled(false)
                    } else {

                    }
                }).catch(err => {
                    //setMessage('')
                }).finally(() => {
                    setPollCounter(pollCounter + 1)
                    if (pollCounter > 5) {
                        setRunData(null)
                        setIsPollingEnabled(false)
                    }
                })
        };

        const startPolling = () => {
            timerIdRef.current = setInterval(pollingCallback, 1500);
        };

        const stopPolling = () => {
            setIsLoading(false)
            clearInterval(timerIdRef.current);
        };

        if (runData !== null && (message === null || message === '')) {
            startPolling();
        } else {
            stopPolling();
        }

        return () => {
            stopPolling();
        };
    }, [runData, isPollingEnabled])

    useEffect(() => {
        if (message === '') return;    
        if (!conversationSid) return;
        
        let currentInput = inputState;
        if (currentInput.length > 0 && currentInput.charAt(currentInput.length - 1) !== ' ') {
            currentInput += ' ';
        }

        currentInput += message;

        Flex.Actions.invokeAction('SetInputText', {
            body: currentInput,
            conversationSid,
            selectionStart: currentInput.length,
            selectionEnd: currentInput.length,
        });
    }, [message])

    return (
        <Box marginRight="space30">
            <Button variant="secondary" size="circle" onClick={handleIAGenerate}>
                {isLoading &&
                    <Spinner decorative={false} title="Loading" />}
                
                {!isLoading &&
                    <NewIcon decorative={false} title="Generar respuesta con IA" />}
            </Button>
        </Box>
    );
}