import React, { useState, useEffect, useCallback } from 'react';
import * as Flex from "@twilio/flex-ui";
import { Actions } from "@twilio/flex-ui";
import { Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions, Stack, Box, Button, Badge, Paragraph, Table, THead, Tr, Th, TBody, Td, Text, Input } from '@twilio-paste/core';
import { ContentApprovalInstance } from 'types/WhatsAppTemplates';
import { getStrings } from '../../../utils/helpers'
import { useSelector } from 'react-redux';
import useApi from '../../../hooks/useApi';

type WhatsAppTemplateProps = {
    task: Flex.ITask
    manager: Flex.Manager
    item: ContentApprovalInstance
    isOpen: boolean
    closeHandler: (close: boolean) => any
}

type Parameters = {
    [ key: string] : string | null
}

Flex.Notifications.registerNotification({
    id: "whatsapptemplate_sendmessage",
    content: 'Error',
    type: Flex.NotificationType.error
});

const WhatsAppTemplate: React.FunctionComponent<WhatsAppTemplateProps> = ({ task, manager, item, isOpen, closeHandler }) => {

    const { sendMessage } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
    const [parameters, setParameters] = useState<Parameters>({})
    const language = useSelector((state: any) => state.language ?? 'es')
    const [strings, setStrings] = useState<{ [key: string]: string }>(getStrings(language ?? 'es'))
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const [isSending, setIsSending] = useState<boolean>(false)

    const getBody = useCallback(() => {
        let body = item.types[item.approvalRequests.content_type].body
        Object.keys(parameters).forEach((key) => {
            if (parameters[key] !== null) {
                body = body.replaceAll(`{{${key}}}`, parameters[key])
            }
        })

        return body
    }, [item, parameters])

    useEffect(() => {
        setStrings(language ?? 'es')
    }, [language])

    useEffect(() => {
        let newParams: Parameters = {}
        if (item) {
            Object.keys(item.variables).forEach((key: string) => {
                newParams[key] = null
            })

            setParameters(newParams)
        }
    }, [item])

    useEffect(() => {
        let filled = true
        if (parameters !== null) {
            Object.keys(parameters).forEach((key: string) => {
                if (parameters[key] === null || parameters[key] === '') {
                    filled = false;
                    return;
                }
            })
        }

        setIsDisabled(!filled)
            
    }, [parameters])

    const updateParam = (key: string, value: string) => {
        let newValue = value !== '' ? value : null
        setParameters({
            ...parameters,
            [key]: newValue
        })
    }

    const submitTemplate = async () => {
        // Enviar mensaje
        setIsSending(true)
        await sendMessage(item.sid, parameters, task.attributes.conversationSid)
            .then((response) => {
                // Cierra modals
                if (response.hasOwnProperty('error')) {
                    showError(response.error)
                }

                setIsSending(false)
                closeHandler(true)
            }).catch((error) => {
                showError(error.message)
                setIsSending(false)
                closeHandler(true)
            })
    }

    const showError = (error: any) => {
        if (error) {
            let notification = Flex.Notifications.registeredNotifications.get('whatsapptemplate_sendmessage')
            if (notification) {
                notification.content = error
            }
            Flex.Notifications.showNotification("whatsapptemplate_sendmessage", undefined);
        }
    }

    if (!item) {
        return null
    }

    return (
        <Modal ariaLabelledby="whatsapp-templates-modal" isOpen={isOpen} onDismiss={() => closeHandler(false)} size="wide">
            <ModalHeader>
                <ModalHeading as="h3" id="whatsapp-templates-modal">{item.friendlyName}</ModalHeading>
            </ModalHeader>
            
            <ModalBody>

                <Stack spacing='space40' orientation='vertical'>
                    <Box display="flex" columnGap="space40" marginBottom={'space20'}>
                        <Badge as="span" variant="decorative10">{item.approvalRequests.category}</Badge>
                        <Badge as="span" variant="decorative40">{item.language}</Badge>
                    </Box>
                    <Paragraph>{getBody()}</Paragraph>
                    {Object.keys(item.variables).length !== 0 && (
                        <Table>
                            <THead>
                                <Tr>
                                    <Th>{ strings['Variables'] }</Th>
                                    <Th>{ strings['Values'] }</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {Object.keys(item.variables).length !== 0 && Object.keys(item.variables).map((key) => (
                                    <Tr key={`variable-key-${key}`}>
                                        <Td>
                                            <Text as="p">{`{{${key}}}`}</Text>
                                        </Td>
                                        <Td>
                                            <Input type='text' placeholder={item.variables[key]} onChange={(e) => updateParam(key, e.target.value)} />
                                        </Td>
                                    </Tr>
                                ))}
                                
                            </TBody>
                        </Table>
                    )}
                    
                    
                </Stack>

            </ModalBody>
            <ModalFooter>
                <ModalFooterActions>
                    <Button variant="secondary" onClick={() => closeHandler(false)}>{strings['Cancel']}</Button>
                    <Button variant="primary" onClick={submitTemplate}
                        disabled={isDisabled}
                        loading={isSending}
                    >{strings['Send']}</Button>
                </ModalFooterActions>
            </ModalFooter>
        </Modal>
    )
}

export default WhatsAppTemplate