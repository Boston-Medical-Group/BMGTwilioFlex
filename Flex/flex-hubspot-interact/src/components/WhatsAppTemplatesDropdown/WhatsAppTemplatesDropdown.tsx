import React, { useState, useEffect } from 'react';
import { Actions, ITask, useFlexSelector, TaskHelper } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Tooltip } from '@twilio-paste/tooltip';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon';
import { Button } from '@twilio-paste/button';
import * as Flex from "@twilio/flex-ui";
import { WhatsAppTemplate } from '../../types/WhatsAppTemplates';
import useApi from '../../hooks/useApi';
import { Card, Heading, Stack, Text } from '@twilio-paste/core';
import { Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions, Paragraph } from '@twilio-paste/core';

interface WhatsAppTemplatesDropdownProps {
    task: ITask;
    manager: Flex.Manager
}

const WhatsAppTemplatesDropdown: React.FunctionComponent<WhatsAppTemplatesDropdownProps> = ({ task, manager }) => {

    const { getTemplates } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
    const [templateList, setTemplateList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const conversationSid = task.attributes.conversationSid ?? task.attributes.channelSid;
    const inputState = useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid]?.inputText);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

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
                            <Stack orientation="vertical" spacing="space60">
                            {
                                templateList.map((item : WhatsAppTemplate, index) => {
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
            {error && (
                <Tooltip text="Error obteniendo plantillas">
                    <Button variant={'destructive_icon'}>
                        <ErrorIcon decorative />
                    </Button>
                </Tooltip>
            )}
        </Box>
    );
};

export default WhatsAppTemplatesDropdown;