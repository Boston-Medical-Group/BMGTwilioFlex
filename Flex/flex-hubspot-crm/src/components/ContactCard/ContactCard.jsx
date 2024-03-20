import React, { useEffect, useCallback, useState } from 'react';
import * as Flex from "@twilio/flex-ui";
import { Theme } from '@twilio-paste/core/theme';
import { Box, Card, Heading, Paragraph, Button, Flex as FlexBox, Stack, Avatar, DescriptionList, DescriptionListSet, DescriptionListTerm, DescriptionListDetails, Tabs, TabList, Tab, TabPanels, TabPanel } from '@twilio-paste/core';
import useApi from '../../hooks/useApi';
// @ts-ignore
import { fullName } from '../../utils/helpers';
import gravatarUrl from 'gravatar-url';
import { Summary, ConversationHistory } from './ContactCardModules'

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const ContactCard = ({ manager, task, contact, contactId }) => {
    const { startOutboundConversation } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

    const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);
    const [selectedSmsContact, setSelectedSmsContact] = useState();
    const [selectedWAContact, setSelectedWAContact] = useState();
    const [doNotCall, setDoNotCall] = useState(true);
    const [doNotWhatsapp, setDoNotWhatsapp] = useState(true);


    const [avatar, setAvatar] = useState();

    

    const afterSetActivityListener = useCallback((payload) => {
        if (payload.activityAvailable) {
            setActionDisabled(false)
        } else {
            setActionDisabled(true)
        }
    }, []);

    /** DO NOT CALL & DO NOT WHATSAPP */
    useEffect(() => {

        setAvatar(gravatarUrl(contact?.email))

        console.log(task)
        const parseBool = (val) => val === true || val === "true"
        let dnc = typeof contact?.donotcall === 'string' ? parseBool(contact.donotcall.toLowerCase()) : (contact.donotcall ?? false);
        setDoNotCall(dnc ? true : false)

        let dnw = typeof contact?.whatsappoptout === 'string' ? parseBool(contact.whatsappoptout.toLowerCase()) : (contact.whatsappoptout ?? false);
        setDoNotWhatsapp(dnw ? true : false)

    }, [])

    useEffect(() => {
        Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

        return () => {
            Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
        }
    }, [afterSetActivityListener])

    const sendSmsHandler = useCallback((contact, deal) => {
        setSelectedSmsContact(contact);
    }, []);

    /*
    const sendWAHandler = React.useCallback((data : HubspotContact) => {
      // get last active conversation window
      const lastConversation = getLastConversation(data)
  
      // if no conversation window, open whatsapp modal
      setSelectedWAContact(data);
    }, []);
    */

    const sendWAHandler = useCallback((contact, deal) => {
        if (contact.country) {
            const countryMap = {
                CO: '+57',
                PE: '+51',
                AR: '+54',
                ES: '+34',
                MX: '+52',
                EC: '+593',
                BR: '+55',
            }

            if (contact.phone && !contact.phone.startsWith('+') && countryMap.hasOwnProperty(contact.country)) {
                const currentCode = countryMap[contact.country];
                // if contact.phone doesn't have country code, add it
                if (contact.phone && !contact.phone.startsWith(currentCode)) {
                    contact.phone = `${currentCode}${contact.phone}`;
                }
            }
        }


        // @todo corregir telefono e164
        startOutboundConversation({
            To: `whatsapp:${contact.phone}`,
            customerName: `${contact.firstname || ''} ${contact.lastname || ''}`.trim(),
            WorkerFriendlyName: manager.workerClient ? manager.workerClient.name : '',
            KnownAgentRoutingFlag: false,
            OpenChatFlag: true,
            hubspotContact: contact,
            hubspot_contact_id: contact.hs_object_id,
            hubspot_deal_id: deal?.hs_object_id ?? null
        })
    }, []);

    const handleCloseModel = React.useCallback(() => {
        setSelectedSmsContact(undefined);
        setSelectedWAContact(undefined);
    }, []);

    const sendCalendarHandler = useCallback(() => {
        window.open(calendar(), '_blank');
    }, [])

    const calendar = useCallback(() => {
        if (process.env.FLEX_APP_CALENDAR_URL_FIELD != undefined) {
            const myVar = process.env.FLEX_APP_CALENDAR_URL_FIELD;

            if (deal && typeof deal === 'object') {
                if (deal.hasOwnProperty(myVar)) {
                    return deal[myVar] ?? '';
                }
            }

            return contact[myVar] ?? '';
        }

        return '';
    }, [actionDisabled])

    if (!contact.hasOwnProperty('hs_object_id')) {
        return null;
    }

    return (
        <Theme.Provider theme="default">
            <>
                <Box padding="space40" width="100%">
                    <Card padding="space20">
                        <FlexBox direction={['row', 'column', 'column']}>
                            <FlexBox minWidth={['100%', '200px', '300px']}>
                                <Box padding="space40">
                                    <Stack spacing="space50" orientation="vertical">
                                        <Avatar size="sizeIcon110" name={fullName(contact)} variant="entity" src={avatar} />
                                        <Heading as="h3" variant="heading30">{fullName(contact)}</Heading>
                                        <DescriptionList>
                                            <DescriptionListSet>
                                                <DescriptionListTerm>Fecha Creación</DescriptionListTerm>
                                                <DescriptionListDetails>{contact.createdate}</DescriptionListDetails>
                                            </DescriptionListSet>
                                        </DescriptionList>
                                    </Stack>
                                </Box>
                            </FlexBox>
                            <FlexBox grow>
                                <Box padding="space40" width="100%">
                                    <Tabs baseId="horizontal-tabs-example">
                                        <TabList aria-label="Horizontal product tabs">
                                            <Tab>Overview</Tab>
                                            <Tab>Historial</Tab>
                                        </TabList>
                                        <TabPanels>
                                            <TabPanel>
                                                <Summary manager={manager} task={task} />
                                            </TabPanel>
                                            <TabPanel>
                                                <ConversationHistory manager={manager} contact={contact} currentConversation={task?.attributes?.conversationSid} />
                                            </TabPanel>
                                        </TabPanels>
                                    </Tabs>
                                </Box>
                            </FlexBox>
                        </FlexBox>
                        
                        
                    </Card>
                </Box>
            </>
        </Theme.Provider>
    );
};

export default ContactCard