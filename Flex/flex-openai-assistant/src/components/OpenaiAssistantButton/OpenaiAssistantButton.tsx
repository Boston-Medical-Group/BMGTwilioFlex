import * as Flex from "@twilio/flex-ui"
import { Button, Spinner, Box } from "@twilio-paste/core"
import { NewIcon } from "@twilio-paste/icons/esm/NewIcon"
import { useCallback, useState, useEffect, useRef } from "react"
import useApi from "../../hooks/useApi"
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

type MyProps = {
    task: Flex.ITask
    manager: Flex.Manager
}

type RunData = {
    thread_id: string
    run_id: string
}
type RunResult = null | RunData


export const OpenaiAssistantButton = ({ manager, task }: MyProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AssitantButton manager={manager} task={task} />
        </QueryClientProvider>
    )
}

const AssitantButton = ({ task, manager }: MyProps) => {

    const { createRun, getRunStatus } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

    const [showSpinner, setShowSpinner] = useState(false)
    const [runData, setRunData] = useState<null | RunData>(null)
    const [message, setMessage] = useState('')
    const conversationSid = task.attributes.conversationSid ?? task.attributes.channelSid;
    const inputState = Flex.useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid]?.inputText);

    const [runPoll, setRunPoll] = useState(false)

    const handleIAGenerate = async () => {
        setShowSpinner(true)
        await createRun({
            conversation_sid: conversationSid
        }).then(async (run: RunResult) => {
            if (run !== null) {
                setRunData({
                    thread_id: run.thread_id,
                    run_id: run.run_id
                })
            }
        }).catch((err) => {
            console.error(err)
            setShowSpinner(false)
        })
    }

    const { isLoading, isError, data } = useQuery({
        //@ts-ignore
        queryKey: ['iaMessage'],
        queryFn: async () => getRunStatus(runData).then((msg: { code: string, body: string | null }) => {
            if (msg.code === "SUCCESS" && msg.body !== null) {
                setRunData(null)
                setMessage(msg.body)
                setShowSpinner(false)
            } else if (msg.code === "NOT_FOUND" || msg.code === "NOT_TEXT") {
                setRunData(null)
                setMessage('')
                setShowSpinner(false)
            } else {
                throw new Error('Queued message')
            }

            return msg
        }),
        retry: 4,
        enabled: runData !== null
    }, [])

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
            <Button variant="secondary" size="circle" disabled={isLoading || showSpinner} onClick={handleIAGenerate}>
                {(isLoading || showSpinner) &&
                    <Spinner decorative={false} title="Loading" />}
                
                {(!isLoading && !showSpinner) &&
                    <NewIcon decorative={false} title="Generar respuesta con IA" />}
            </Button>
        </Box>
    );
}