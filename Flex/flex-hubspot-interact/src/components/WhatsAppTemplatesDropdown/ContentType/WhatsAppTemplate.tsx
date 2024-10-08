import React, { useState, useEffect, useCallback } from 'react';
import * as Flex from "@twilio/flex-ui";
import {
    Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions,
    Stack, Box, Button, Badge, Paragraph, Table, THead, Tr, Th, TBody, Td, Text, Input
} from '@twilio-paste/core';
import { SendIcon } from "@twilio-paste/icons/esm/SendIcon";
import { ContentApprovalInstance } from 'types/WhatsAppTemplates';
import { useSelector } from 'react-redux';
import useApi from '../../../hooks/useApi';
import useLang from '../../../hooks/useLang';

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

/**
 * Available replazable parameters:
 * 
 * country
 * email
 * firstname
 * id
 * lastname
 * phone
 * calendar
 * worker_fullname
 * worker_email
 *
 */


const WhatsAppTemplate: React.FunctionComponent<WhatsAppTemplateProps> = ({ task, manager, item, isOpen, closeHandler }) => {
    const { _l } = useLang();
    const { sendMessage } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
    const [parameters, setParameters] = useState<Parameters>({})
    
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

    // Carga los parametros de la plantilla
    useEffect(() => {
        if (item) {
            discoverParameterValue(item.variables)
        }
    }, [item])

    // Carga valores por defecto de los parametros
    const discoverParameterValue = (variables: {[key: string] : string}) => {
        type ParametersMap = {
            [key: string]: string[]
        }
        type WorkerParametersMap = {
            [key: string]: () => string
        }

        const workerParameters : WorkerParametersMap = {
            fullname: (): string => manager.workerClient?.attributes?.full_name ?? '',
            email: (): string => manager.workerClient?.attributes?.email ?? ''
        }

        const parameterMap: ParametersMap = {
            country: ['country'],
            email: ['email'],
            firstname: ['firstname'],
            id: ['hs_object_id'],
            lastname: ['lastname'],
            phone: ['phone', 'numero_de_telefono_adicional', 'numero_de_telefono_adicional_'],
            calendar: ['reservar_cita'],
        }

        let contact = task.attributes?.hubspotContact
        let newParams: { [key: string]: string | null } = {}

        Object.keys(variables).forEach((key: string) => {
            let varName = variables[key]
            newParams[key] = null;
            if (varName.startsWith('worker_')) {
                let workerParameter = varName.replace('worker_', '');
                if (workerParameters.hasOwnProperty(workerParameter)) {
                    newParams[key] = workerParameters[workerParameter]()
                    return
                }
            }

            if (!parameterMap.hasOwnProperty(varName)) {
                return
            }

            parameterMap[varName].forEach((item: string) => {
                if (typeof contact == 'object' && contact.hasOwnProperty(item) && contact[item] !== '') {
                    newParams[key] = contact[item]
                    return
                }
            })
        })

        setParameters(newParams)
    }

    // Desactiva el envío si no se han completado todos los valores
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
                                    <Th>{ _l('Variables') }</Th>
                                    <Th>{ _l('Values') }</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {Object.keys(item.variables).length !== 0 && Object.keys(item.variables).map((key) => (
                                    <Tr key={`variable-key-${key}`}>
                                        <Td>
                                            <Text as="p">{`{{${key}}}`}</Text>
                                        </Td>
                                        <Td>
                                            <Input type='text' defaultValue={parameters[key]?.toString()} placeholder={item.variables[key]} onChange={(e) => updateParam(key, e.target.value)} />
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
                    <Button variant="secondary" onClick={() => closeHandler(false)}>{_l('Cancel')}</Button>
                    <Button variant="primary" onClick={submitTemplate}
                        disabled={isDisabled}
                        loading={isSending}
                    >
                        {_l('Send')}
                        <SendIcon decorative={false} title="Description of icon" />
                    </Button>
                </ModalFooterActions>
            </ModalFooter>
        </Modal>
    )
}

export default WhatsAppTemplate