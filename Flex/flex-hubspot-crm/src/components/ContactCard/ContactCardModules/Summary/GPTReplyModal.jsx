import { Box, Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions, Paragraph, Label, Stack, Button, Input, TextArea, HelpText, SkeletonLoader, Separator } from "@twilio-paste/core"
import { useUID } from "@twilio-paste/core/dist/uid-library"
import { useEffect, useState, useCallback } from "react";
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Flex from "@twilio/flex-ui"
import { Actions, useFlexSelector, Notifications, NotificationType } from "@twilio/flex-ui";
import { SendIcon } from "@twilio-paste/icons/esm/SendIcon";

const queryClient = new QueryClient()

const createThreadAndRun = async (manager, conversationSid, instruction) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/crm/createAssistantThread`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            conversationSid,
            instruction,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        })
    });

    return request.json();
}

const getRunStatus = async (manager, data) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/crm/getAssistantRunResult`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            thread_id: data.thread_id,
            run_id: data.run_id,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        })
    });

    return await request.json();
}


const GPTReplyModal = ({ manager, isOpen, handleClose, conversationSid, channelSid, messagesCount }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <GPTReplyModalComponent manager={manager} isOpen={isOpen}
                handleClose={handleClose} conversationSid={conversationSid} messagesCount={messagesCount}
                channelSid={channelSid} />
        </QueryClientProvider>
    )
}

const registerNotifications = () => {
    Notifications.registerNotification({
        id: "errorNotEnoughMessages",
        content: "No hay suficiente contexto para generar una sugerencia",
        type: NotificationType.error
    });
}

const GPTReplyModalComponent = ({ manager, isOpen, handleClose, conversationSid, channelSid, messagesCount }) => {
    const modalHeadingID = useUID();

    const [polling, setPolling] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [instruction, setInstruction] = useState("");
    const [runData, setRunData] = useState({})
    const inputState = useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid]?.inputText);

    useEffect(() => {
        registerNotifications()
    }, [])

    useEffect(() => {
        // Al abrir modal, cargar una sugerencia de respuesta
        if (isOpen) {
            getReplySuggestion()
        }
    }, [isOpen])

    const { isLoading, isInitialLoading, isError, data } = useQuery({
        //@ts-ignore
        queryKey: ['iaMessage'],
        queryFn: async () => getRunStatus(manager, runData).then((msg) => {
            if (msg.code === "SUCCESS" && msg.body !== null) {
                setMessage(msg.body)
                setLoading(false)
                setPolling(false)
            } else if (msg.code === "NOT_FOUND" || msg.code === "NOT_TEXT") {
                setMessage('')
                setLoading(false)
                setPolling(false)
            } else {
                throw new Error('Queued message')
            }

            return msg
        }),
        retry: 4,
        enabled: polling
    }, [])

    const getReplySuggestion = useCallback(async () => {
        if (messagesCount === 0) {
            handleClose()
            Notifications.showNotification('errorNotEnoughMessages');
            console.log('NOT ENOUGH MESSAGES')
        } else {
            setLoading(true)

            await createThreadAndRun(manager, conversationSid, instruction)
                .then(async (run) => {
                    if (run.hasOwnProperty('error')) {
                        Notifications.showNotification('errorNotEnoughMessages');
                        console.log('NOT ENOUGH CLIENT MESSAGES')
                        handleClose()
                        return
                    } else if (run !== null) {
                        setRunData({
                            thread_id: run.thread_id,
                            run_id: run.id
                        })
                        setPolling(true)
                    }
                }).catch((err) => {
                    console.error(err)
                    setPolling(false)
                    setLoading(false)
                })
        }
    }, [messagesCount, instruction])

    const applySuggestion = () => {
        if (!message) return;

        let currentInput = inputState;
        if (currentInput.length > 0 && currentInput.charAt(currentInput.length - 1) !== ' ') {
            currentInput += ' ';
        }
        currentInput += message;

        Actions.invokeAction('SetInputText', {
            body: currentInput,
            conversationSid,
            selectionStart: currentInput.length,
            selectionEnd: currentInput.length,
        });

        setMessage("")
        handleClose()
    }

    const sendSuggestion = () => {
        if (!message) return;

        Actions.invokeAction("SendMessage", {
            body: message,
            conversationSid
            /*channelSid: channelSid*/
        });

        setMessage("")
        handleClose()
    }

    const handleInputChange = useCallback((e) => {
        setInstruction(e.target.value)
    })

    if (!isOpen) {
        return ''
    }

    return (
        <Modal ariaLabelledby={modalHeadingID} isOpen onDismiss={handleClose} size="default">
            <ModalHeader>
                <ModalHeading as="h3" id={modalHeadingID}>
                    Asistente IA
                </ModalHeading>
            </ModalHeader>
            <ModalBody>

                <Paragraph>
                    Hola. Soy el asistente IA. Basándome en la conversación actual y en el contexto generado, te sugiero esta respuesta:
                </Paragraph>

                {(loading || isLoading) ? (
                    <Stack orientation="vertical" spacing="space20">
                        <SkeletonLoader />
                        <SkeletonLoader />
                        <SkeletonLoader width="80px" />
                    </Stack>
                ) : (
                    <Box>
                        <TextArea value={message} onChange={(e) => setMessage(e.target.value)} />
                    </Box>
                )}

                <Box backgroundColor="colorBackgroundBody" padding="space50">
                    <Separator orientation="horizontal" verticalSpacing="space50" />
                </Box>

                <Box>
                    <Label htmlFor="refine">Refinar sugerencia </Label>
                    <Input maxLength="255" aria-describedby="refine_reply" id="refine_reply" name="refine_reply" type="text" placeholder="" onChange={handleInputChange} required />
                    <HelpText id="refine_reply_text">Agrega una instrucción que te ayude a mejorar la respuesta. (Máx. 255 caracteres)</HelpText>

                    <Box paddingTop="space40">
                        <Button variant="primary" onClick={() => getReplySuggestion()} disabled={loading}>Refinar</Button>
                    </Box>
                </Box>
            </ModalBody>
            <ModalFooter>
                <ModalFooterActions>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary_inverted" onClick={applySuggestion}>Usar sugerencia</Button>
                    <Button variant="primary" onClick={sendSuggestion}>
                        <SendIcon decorative={false} title="Enviar sugerencia" />
                        Enviar sugerencia</Button>
                </ModalFooterActions>
            </ModalFooter>
        </Modal>
    )
}

export default GPTReplyModal