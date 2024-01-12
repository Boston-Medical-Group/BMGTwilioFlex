import React, { useState, useEffect } from 'react';
import { Actions, ITask, useFlexSelector, TaskHelper } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Tooltip } from '@twilio-paste/tooltip';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon';
import { WarningIcon } from '@twilio-paste/icons/esm/WarningIcon';
import { CloseIcon } from '@twilio-paste/icons/esm/CloseIcon';
import { Button } from '@twilio-paste/button';
import * as Flex from "@twilio/flex-ui";
import { WhatsAppTemplate } from '../../types/WhatsAppTemplates';
import useApi from '../../hooks/useApi';
import { Card, DescriptionList, DescriptionListDetails, DescriptionListSet, DescriptionListTerm, Heading, Input, Label, Stack, Text } from '@twilio-paste/core';
import { Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions, Paragraph } from '@twilio-paste/core';

interface WhatsAppTemplatesDropdownProps {
    task: ITask;
    manager: Flex.Manager
}

const WhatsAppTemplatesDropdown: React.FunctionComponent<WhatsAppTemplatesDropdownProps> = ({ task, manager }) => {

    const { getTemplates, getMessageErrors } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
    const [templateList, setTemplateList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingErrors, setIsLoadingErrors] = useState(false);
    const [search, setSearch] = useState("");
    const [messageErrors, setMessageErrors] = useState([]);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorsOpen, setIsErrorsOpen] = useState(false);
    const conversationSid = task.attributes.conversationSid ?? task.attributes.channelSid;
    const inputState = useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid]?.inputText);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenErrors = () => {
        setMessageErrors([])
        setIsLoadingErrors(true)
        setIsErrorsOpen(true)

        getMessageErrors(task.attributes.conversationSid)
            .then((data) => {
                setMessageErrors(data)
                setIsLoadingErrors(false)
            })
    };
    const handleCloseErrors = () => {
        setMessageErrors([])
        setIsErrorsOpen(false)
    };

    const onClickInsert = (text: string) => {
        if (!conversationSid) return;
        let currentInput = inputState;
        if (currentInput.length > 0 && currentInput.charAt(currentInput.length - 1) !== ' ') {
            currentInput += ' ';
        }
        currentInput += text;

        Actions.invokeAction('SetInputText', {
            body: currentInput,
            conversationSid,
            selectionStart: currentInput.length,
            selectionEnd: currentInput.length,
        });
    };

    const errorMessageString = (code : number) => {
        if (code === 63016) {
            return 'Fuera de la ventana de 24 horas. Inicie la conversación utilizando una plantilla de WhatsApp'
        } else {
            return 'Error no catalogado'
        }
    }

    useEffect(() => {
        setIsLoading(true);
        setTemplateList([]);
        setError(false);

        getTemplates({
            hubspot: {
                contact: task.attributes.hubspotContact,
                deal: task.attributes.deal ?? {},
                hubspot_id: task.attributes.hubspot_contact_id ?? null,
                contact_id: task.attributes.hubspot_contact_id ?? null,
                deal_id: task.attributes.hubspot_deal_id ?? null,
            }
        })
            .then((data) => { setTemplateList(data) })
            .catch(() => setError(true))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <>
            <Box paddingLeft='space30'>
                {isLoading && <SkeletonLoader />}
                {Boolean(templateList) && !isLoading && (
                    <>
                        <Button variant="secondary" size="circle" onClick={handleOpenModal}>
                            <ChatIcon decorative={false} title="Plantillas" />
                        </Button>
                        <Modal ariaLabelledby="whatsapp-templates-modal" isOpen={isModalOpen} onDismiss={handleCloseModal} size="wide">
                            <ModalHeader>
                                <ModalHeading as="h3" id="whatsapp-templates-modal">Seleccione una plantilla</ModalHeading>
                            </ModalHeader>
                            <ModalBody>

                                <Box marginBottom='space30'>
                                    <Label htmlFor="search">Filtrar plantillas</Label>
                                    <Input id="search" name="search" type="email" value={search} placeholder="Filtrar" onChange={(event) => setSearch(event.target.value)}
                                        insertAfter={
                                            <Button variant="link" onClick={() => setSearch("")}>
                                                <CloseIcon decorative={false} size="sizeIcon20" title="Limpiar" />
                                            </Button>
                                        }
                                    />
                                </Box>
                                <Stack orientation="vertical" spacing="space60">
                                {
                                    templateList.map((item: WhatsAppTemplate, index) => {
                                        if (search.length < 3 || (search.length >= 3 && item.name.includes(search))) {
                                            return (
                                                <Card key={index} padding='space60'>
                                                    <Heading as="h3" variant="heading30">{item.name}</Heading>
                                                    <Paragraph>{item.message}</Paragraph>
                                                    <Button variant="primary" type='button'
                                                        onClick={() => {
                                                            onClickInsert(item.message);
                                                            handleCloseModal();
                                                        }}>Seleccionar</Button>

                                                </Card>
                                            )
                                        }
                                    })
                                }
                                </Stack>
                            </ModalBody>
                            <ModalFooter>
                                <ModalFooterActions>
                                    <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                                </ModalFooterActions>
                            </ModalFooter>
                        </Modal>
                    </>
                )}
            </Box>
            <Box paddingLeft='space30'>
                <Button variant="secondary" size="circle" onClick={handleOpenErrors}>
                    <WarningIcon decorative={false} title="Ver errores" />
                </Button>
                <Modal ariaLabelledby="message-errors-modal" isOpen={isErrorsOpen} onDismiss={handleCloseErrors} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id="message-errors-modal">Últimos errores</ModalHeading>
                    </ModalHeader>
                    <ModalBody>
                        
                        <DescriptionList>                        
                            {isErrorsOpen && isLoadingErrors && (<SkeletonLoader />)}
                            {!isLoadingErrors &&
                                messageErrors.map((error : { date: Date, code: number }, index) => {
                                    return (
                                        <DescriptionListSet key={index}>
                                            <DescriptionListTerm>{error.date}</DescriptionListTerm>
                                            <DescriptionListDetails>
                                                <strong>{error.code}</strong>: {errorMessageString(error.code)}
                                                
                                            </DescriptionListDetails>
                                        </DescriptionListSet>
                                    )
                                })
                            }
                        </DescriptionList>
                    </ModalBody>
                </Modal>
                {error && (
                    <Tooltip text="Error obteniendo plantillas">
                        <Button variant={'destructive_icon'}>
                            <ErrorIcon decorative />
                        </Button>
                    </Tooltip>
                )}
            </Box>
        </>
    );
};

export default WhatsAppTemplatesDropdown;