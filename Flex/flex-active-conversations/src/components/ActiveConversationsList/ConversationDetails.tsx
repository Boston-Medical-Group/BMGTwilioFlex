import * as Flex from '@twilio/flex-ui'
import {
    SideModalContainer, SideModal, SideModalHeader, SideModalHeading, SideModalBody, Paragraph,
    useSideModalState,
    SkeletonLoader, Heading,
    Box,
    DescriptionList,
    DescriptionListSet,
    DescriptionListTerm,
    DescriptionListDetails,
    Text, Tooltip, Anchor
} from '@twilio-paste/core';
import { useEffect, useState } from 'react';
import {InformationIcon} from '@twilio-paste/icons/esm/InformationIcon'
import useApi from '../../hooks/useApi';
import useLang from '../../hooks/useLang';
import ConversationTranscription from './ConversationTranscription';
import CloseActiveConversationButton from './CloseActiveConversationButton';

type Props = {
    manager: Flex.Manager
    conversationSid: string
    closeCallback?: () => void
}

const closeConversation = async (manager: Flex.Manager, conversationSid: string) => {
    return fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/closeConversation`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            conversationSid,
            Token: manager.store.getState().flex.session.ssoTokenPayload.token
        })
    })
        .then((resp) => resp.json());
}

const ConversationDetails = ({ conversationSid, manager, closeCallback }: Props) => {

    const [isClosing, setIsClosing] = useState(false)
    const { getConversation } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
    const { _l } = useLang();

    const dialog = useSideModalState({});

    const [conversation, setConversation] = useState<any>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (conversationSid !== undefined) {
            setIsLoading(true)
            dialog.show();
                
            (async () => {
                const conv = await getConversation(conversationSid)
                setConversation(conv)
                console.log(conv)
                setIsLoading(false)
            })();
        } else {
            dialog.hide()
        }

        return () => {

        }
    }, [conversationSid])

    const formatConversationHeading = (participants: Array<any>) => {
        const userParticipant = participants.find((participant: any) => participant.messagingBinding !== undefined && participant.messagingBinding !== null)
        if (userParticipant !== undefined) {
            return userParticipant.messagingBinding.address ?? conversation.sid
        }

        if (conversation !== undefined) {
            return conversation.sid
        }
        
        return 'Conversation details'
    }

    return (
        <SideModalContainer state={dialog}>
            <SideModal aria-label="Basic Side Modal">
                <SideModalHeader>
                    <SideModalHeading>
                        {isLoading
                            ? <SkeletonLoader width={'50%'} />
                            : formatConversationHeading(conversation?.participants)
                        }
                    </SideModalHeading>
                </SideModalHeader>
                <SideModalBody>
                    {isLoading && <SkeletonLoader height={'150px'} />}
                    
                    {!isLoading && conversation && (
                        <Box>
                            <DescriptionList>
                                <DescriptionListSet>
                                    <DescriptionListTerm>
                                        <Tooltip text={_l('1 participant points to an orphan or a transactional conversation, 2 participants could be an active conversation')}>
                                            <Box display="flex">
                                                {_l('Participants')}
                                                <InformationIcon decorative={false} title="Tooltip" display="block" />
                                            </Box>
                                        </Tooltip></DescriptionListTerm>
                                    <DescriptionListDetails>
                                        <Text as="span">{conversation?.participants?.length ?? 0}</Text>
                                    </DescriptionListDetails>
                                </DescriptionListSet>

                                {conversation?.participants && conversation.participants.length > 0 && conversation.participants.map((participant: any, index : any) => (
                                    <DescriptionListSet key={participant.sid}>
                                        <DescriptionListTerm>{_l('Participant')} {index + 1}</DescriptionListTerm>
                                        <DescriptionListDetails>
                                            <Text as="span">{participant?.messagingBinding?.address ?? participant.identity}</Text>
                                        </DescriptionListDetails>
                                    </DescriptionListSet>
                                ))}

                                <DescriptionListSet>
                                    <DescriptionListTerm>{_l('Create Date')}</DescriptionListTerm>
                                    <DescriptionListDetails>{conversation.dateCreated}</DescriptionListDetails>
                                </DescriptionListSet>
                            </DescriptionList>

                            <ConversationTranscription conversationSid={conversationSid} manager={manager} />

                            <CloseActiveConversationButton manager={manager} conversationSid={conversation.sid} closedCallback={closeCallback} />
                        </Box>
                    )}
                </SideModalBody>
            </SideModal>
        </SideModalContainer>
    )
}

export default ConversationDetails

export { closeConversation }