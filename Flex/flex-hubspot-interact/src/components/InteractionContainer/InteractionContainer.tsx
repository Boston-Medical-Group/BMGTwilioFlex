import * as FlexInstance from '@twilio/flex-ui';
import { useSelector, useDispatch } from 'react-redux';
import InteractionCard from '../InteractionCard'
import { Box, Heading, Flex, Paragraph, SkeletonLoader, Modal, ModalBody, ModalHeader, ModalHeading, Stack } from '@twilio-paste/core';
import { useEffect, useState, useCallback } from 'react';
import useApi from '../../hooks/useApi';
import CallCard from '../InteractionCard/CallCard';
import { actions } from '../../states';
import useLang from '../../hooks/useLang';

type MyProps = {
    flex: typeof FlexInstance
    manager: FlexInstance.Manager
}

const InteractionContainer = ({ flex, manager }: MyProps) => {
    const { _l } = useLang();
    const { getDataByContactId, getDataByDealId, startOutboundConversation } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

    const {contact, deal} = useSelector(
        (state: any) => ({
            contact: state.hubspotInteraction.interaction.contact,
            deal: state.hubspotInteraction.interaction.deal
        })
    );

    const dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState(false)
    const [ showCallCard, setShowCallCard ] = useState(false)
    const [ showInteractionCard, setShowInteractionCard ] = useState(false)
    //const [ contact, setContact ] = useState({})
//    const [deal, setDeal] = useState({})
    const [isOpen, setIsOpen] = useState(false)

    const callHandlerCallback = useCallback((event) => {
        setIsOpen(true)
        setInteraction('call')
    }, [])

    useEffect(() => {
        const handleReceiveMessage = (event: any) => {
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
                    console.info('LOADING DATA FOR CONTACT ID', data.contact_id)
                    loadContact(data.contact_id);
                } else if (data.hasOwnProperty('deal_id')) {
                    console.info('LOADING DATA FOR DEAL ID', data.deal_id)
                    loadContact(null, data.deal_id);
                }
            }
        }

        window.addEventListener("message", handleReceiveMessage);
        return () => {
            window.removeEventListener("message", handleReceiveMessage);
        }
    }, [])

    const resetContactOrDeal = () => {
        setShowCallCard(false);
        setShowInteractionCard(false);
    }

    const loadContact = useCallback(async (contactId = null, dealId = null) => {
        dispatch(actions.interaction.setContact(undefined))
        dispatch(actions.interaction.setDeal(undefined))

        if (!contactId && !dealId) {
            return;
        }

        setIsLoading(true)
        if (contactId) {
            getDataByContactId({ contact_id: contactId, newToken: manager.store.getState().flex.session.ssoTokenPayload.token })
                .then(data => {
                    console.log('LOADED DATA FOR CONTACT ID', contactId, data)
                    dispatch(actions.interaction.setContact(data.properties))
                })
                .catch(() => console.log("Error while fetching data from Hubspot"))
                .finally(() => (setIsLoading(false)))
        } else if (dealId) {
            getDataByDealId({ deal_id: dealId, newToken: manager.store.getState().flex.session.ssoTokenPayload.token })
                .then((data) => {
                    console.log('LOADED DATA FOR DEAL ID', dealId, data)
                    dispatch(actions.interaction.setContact(data.properties))
                    if (data.deal !== undefined && data.deal !== null) {
                        dispatch(actions.interaction.setDeal(data.deal.properties))
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
        } else if (type === 'interaction') {
            setShowCallCard(false)
            setShowInteractionCard(true)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} size="default" onDismiss={() => setIsOpen(false)} ariaLabelledby='interaction-modal'>
                <ModalHeader>
                    <ModalHeading>{_l('Boston Medical/Elexial')}</ModalHeading>
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