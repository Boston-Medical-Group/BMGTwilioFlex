import * as FlexInstance from '@twilio/flex-ui';
import InteractionCard from '../InteractionCard'
import { Box, Heading, Flex, Paragraph, SkeletonLoader, Modal, ModalBody, ModalHeader, ModalHeading, Stack } from '@twilio-paste/core';
import { useEffect, useState, useCallback } from 'react';
import useApi from '../../hooks/useApi';
import CallCard from '../InteractionCard/CallCard';

type MyProps = {
    flex: typeof FlexInstance
    manager: FlexInstance.Manager
}

const InteractionContainer = ({ flex, manager } : MyProps) => {
    const { getDataByContactId, getDataByDealId, startOutboundConversation } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

    const [ isLoading, setIsLoading ] = useState(false)
    const [ showCallCard, setShowCallCard ] = useState(false)
    const [ showInteractionCard, setShowInteractionCard ] = useState(false)
    const [ contact, setContact ] = useState({})
    const [deal, setDeal] = useState({})
    const [isOpen, setIsOpen] = useState(false)

    const callHandlerCallback = useCallback((event) => {
        console.log('EXTERNAL CALL')
        setIsOpen(true)
        setInteraction('call')
    }, [])

    const handleReceiveMessage: any = useCallback((event: any) => {
        // Invoke the Flex Outbound Call Action
        const { data } = event;
        if (data.from === 'FLEX_SCRIPT') {
            resetContactOrDeal()
            setIsOpen(true)
            setIsLoading(true)

            if (data.actionType === 'gotoInteraction') {
                //dispatch(actions.interactionCallCard.setIsLoading(true))
                setInteraction('interaction')
            } else if (data.actionType === 'dial') {
                setInteraction('call')
            }

            if (data.hasOwnProperty('contact_id')) {
                loadContact(data.contact_id);
            } else if (data.hasOwnProperty('deal_id')) {
                loadContact(null, data.deal_id);
            }
        }
    }, [])

    useEffect(() => {
        window.addEventListener("message", handleReceiveMessage);
        return () => {
            window.removeEventListener("message", handleReceiveMessage);
        }
    }, [handleReceiveMessage])

    const resetContactOrDeal = () => {
        setShowCallCard(false);
        setShowInteractionCard(false);
    }

    const loadContact = useCallback(async (contactId = null, dealId = null) => {
        setContact({})
        setDeal({})

        if (!contactId && !dealId) {
            return;
        }

        setIsLoading(true)
        if (contactId) {
            getDataByContactId({ contact_id: contactId, newToken: manager.store.getState().flex.session.ssoTokenPayload.token })
                .then(data => {
                    setContact(data.properties)
                })
                .catch(() => console.log("Error while fetching data from Hubspot"))
                .finally(() => (setIsLoading(false)))
        } else if (dealId) {
            getDataByDealId({ deal_id: dealId, newToken: manager.store.getState().flex.session.ssoTokenPayload.token })
                .then((data) => {
                    setContact(data.properties)
                    if (data.deal !== undefined && data.deal !== null) {
                        setDeal(data.deal.properties)
                    }
                })
                .catch(() => console.log("Error while fetching data from Hubspot"))
                .finally(() => (setIsLoading(false)));
        }
    }, [])

    const setInteraction = (type: string) => {
        if (type === 'call') {
            setShowCallCard(true)
            setShowInteractionCard(false)
            console.log('SHOW CALL')
        } else if (type === 'interaction') {
            setShowCallCard(false)
            setShowInteractionCard(true)
            console.log('SHOW INTERACTION')
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} size="default" onDismiss={() => setIsOpen(false)} ariaLabelledby='interaction-modal'>
                <ModalHeader>
                    <ModalHeading>Boston Medical/Elexial
                    </ModalHeading>
                </ModalHeader>

                <ModalBody>
                    <Stack orientation="vertical" spacing="space60">
                        
                        {isLoading && (
                            <SkeletonLoader height="150px" />
                        )}

                        {!isLoading && showCallCard && (
                            <CallCard manager={manager} contact={contact} deal={deal} interactionHandler={() => setIsOpen(false)} />
                        )}

                        {!isLoading && showInteractionCard && (
                            <InteractionCard manager={manager} contact={contact} deal={deal} callHandler={callHandlerCallback} interactionHandler={() => setIsOpen(false)} />
                        )}
                    </Stack>
                </ModalBody>
            </Modal>
            
        </>
    );

}

export default InteractionContainer