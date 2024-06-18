import React, { useEffect, useState } from 'react';
import { Theme } from '@twilio-paste/core/theme';
import {
    Box, Card, Heading, Stack, Avatar, DescriptionList, DescriptionListSet,
    DescriptionListTerm, DescriptionListDetails, Tabs, TabList, Tab, TabPanels, TabPanel, Truncate
} from '@twilio-paste/core';
// @ts-ignore
import { fullName } from '../../utils/helpers';
import gravatarUrl from 'gravatar-url';
import { Summary, ConversationHistory } from './ContactCardModules'
import { useSelector } from 'react-redux';
import { actions } from '../../states';


const getDataByContactId = async (contact_id, manager) => {
    const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/fetchHubspotContact`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contact_id: contact_id,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        })
    });

    return await request.json();
}

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const ContactCard = ({ manager, task }) => {

    const stateContact = useSelector(state => state.hubspotCRM.contact)
    const dispatch = useDispatch()

    const [contact, setContact] = useState();
    const [contactId, setContactId] = useState();

    const [avatar, setAvatar] = useState();

    useEffect(async () => {
        let hcid = task.attributes?.hubspotContact ?? false
        if (!hcid) {
            if (!task.attributes?.hubspot_contact_id) {
                console.log('CONTACTID NOT FOUND: components/ContactCard/ContactCard.jsx@41')
            }

            await getDataByContactId(task.attributes?.hubspot_contact_id, manager)
                .then((data) => {
                    setContact(data.properties)
                })
        } else {
            setContact(task.attributes?.hubspotContact)
        }
        setContactId(task.attributes?.hubspot_contact_id)
    }, [task])

    /** DO NOT CALL & DO NOT WHATSAPP */
    useEffect(() => {
        if (contact && contact.hasOwnProperty('email')) {
            let email = `${contact.email}`
            if (email.length > 0 && contact.email !== null && contact.email !== '') {
                setAvatar(gravatarUrl(email))
            }
        }

        let taskContact = task.attributes?.hubspotContact ?? {}
        if (!stateContact.hasOwnProperty('hs_object_id') || (taskContact && taskContact.hasOwnProperty('hs_object_id') && taskContact[hs_object_id] != stateContact[hs_object_id])) {
            dispatch(actions.hubspotCRM.setContact(taskContact))
        }

    }, [contact])

    if (!contact || !contact.hasOwnProperty('hs_object_id')) {
        return null;
    }

    return (
        <Theme.Provider theme="default">
            <>
                <Box padding="space40" width="100%">
                    <Card padding="space20">
                        <Box padding="space40" maxWidth="100%">
                            <Stack spacing="space50" orientation="horizontal">
                                <Avatar size="sizeIcon110" name={fullName(contact)} variant="entity" src={avatar} />
                                <Box rowGap="space20">
                                    <Heading as="h3" variant="heading30">
                                        <Truncate>{fullName(contact)}</Truncate>
                                    </Heading>
                                    <DescriptionList>
                                        <DescriptionListSet>
                                            <DescriptionListTerm>Fecha Creación</DescriptionListTerm>
                                            <DescriptionListDetails>{contact.createdate}</DescriptionListDetails>
                                        </DescriptionListSet>
                                    </DescriptionList>
                                </Box>
                            </Stack>
                        </Box>
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
                        
                        
                    </Card>
                </Box>
            </>
        </Theme.Provider>
    );
};

export default ContactCard