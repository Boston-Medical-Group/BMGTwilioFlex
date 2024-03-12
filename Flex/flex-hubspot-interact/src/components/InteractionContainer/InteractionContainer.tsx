import * as FlexInstance from '@twilio/flex-ui';
import InteractionCard from '../InteractionCard'
import { Box, Heading, Flex, Paragraph, SkeletonLoader } from '@twilio-paste/core';
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
    const [ deal, setDeal ] = useState({})

    const callHandlerCallback = useCallback((event) => {
        console.log('EXTERNAL CALL')
        setInteraction('call')
    }, [])

    const handleReceiveMessage: any = useCallback((event: any) => {
        // Invoke the Flex Outbound Call Action
        const { data } = event;
        if (data.from === 'FLEX_SCRIPT') {
            resetContactOrDeal()
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
            <Flex height="100vh" vAlignContent="center" hAlignContent="center" vertical={true} >
                <Box maxWidth={["100%", "80%", "60%"]} alignItems="center">
                    <Heading as="h3" variant="heading20">Boston Medical/Elexial</Heading>
                    <Paragraph>Seleccione un contacto o negocio desde Hubspot para iniciar una interacción</Paragraph>

                    {isLoading && (
                        <SkeletonLoader height="150px" />
                    )}

                    {!isLoading && showCallCard && (
                        <CallCard manager={manager} contact={contact} deal={deal} />
                    )}

                    {!isLoading && showInteractionCard && (
                        <InteractionCard manager={manager} contact={contact} deal={deal} callHandler={callHandlerCallback} />
                    )}
                </Box>
            </Flex>
            
        </>
    );

}

export default InteractionContainer