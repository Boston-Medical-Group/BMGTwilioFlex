import React, { useEffect, useCallback, useState } from 'react';
import * as Flex from "@twilio/flex-ui";
import { Theme } from '@twilio-paste/core/theme';
import { Box, Card, Heading, Paragraph, Button, Flex as FlexBox, Stack, Avatar, DescriptionList, DescriptionListSet, DescriptionListTerm, DescriptionListDetails, Tabs, TabList, Tab, TabPanels, TabPanel, Truncate } from '@twilio-paste/core';
import useApi from '../../hooks/useApi';
// @ts-ignore
import { fullName } from '../../utils/helpers';
import gravatarUrl from 'gravatar-url';
import { Summary, ConversationHistory } from './ContactCardModules'

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const ContactCard = ({ manager, task }) => {

    const [contact, setContact] = useState();
    const [contactId, setContactId] = useState();

    const [avatar, setAvatar] = useState();

    useEffect(() => {
        setContact(task.attributes?.hubspotContact)
        setContactId(task.attributes?.hubspot_contact_id)
        console.log('CONTACTCARD', task)
    }, [task])

    /** DO NOT CALL & DO NOT WHATSAPP */
    useEffect(() => {
        if (contact && contact?.email !== '') {
            console.log('CONTACTAVATAR', contact)
            setAvatar(gravatarUrl(contact?.email))
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
                        <FlexBox direction={['row', 'column', 'column']}>
                            <FlexBox minWidth={['100%', '200px', '300px']} maxWidth="300px">
                                <Box padding="space40" maxWidth="100%">
                                    <Stack spacing="space50" orientation="vertical">
                                        <Avatar size="sizeIcon110" name={fullName(contact)} variant="entity" src={avatar} />
                                        <Heading as="h3" variant="heading30">
                                            <Truncate>{fullName(contact)}</Truncate>
                                        </Heading>
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