import React, { useCallback, useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { Icon } from '@twilio/flex-ui';
import { ButtonGroup, Pagination, PaginationArrow, PaginationItems, PaginationLabel, useSideModalState } from '@twilio-paste/core';
import {
  Box, Table, THead, Tr, Th, TBody, Td, TFoot, Heading, SkeletonLoader, Text, Button
} from '@twilio-paste/core';
import useLang from '../../hooks/useLang'
import useApi from '../../hooks/useApi';
import { humanReadableDate, diffDays } from '../../utils/helpers';
import { WarningIcon } from "@twilio-paste/icons/esm/WarningIcon";
import { ErrorIcon } from "@twilio-paste/icons/esm/ErrorIcon";
import { TimeIcon } from "@twilio-paste/icons/esm/TimeIcon";
import ConversationDetails from './ConversationDetails';
import CloseActiveConversationButton from './CloseActiveConversationButton';

type Props = {
  manager: Flex.Manager
}
type PageUrls = {
  nextPageUrl: string | null,
  previousPageUrl: string | null
}
const ActiveConversationsList = ({ manager }: Props) : JSX.Element | null => {
  const { _l, language } = useLang();

  const { getActiveConversations } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
  const [activeConversations, setActiveConversations] = useState([])
  const [meta, setMeta] = useState<PageUrls>({
    nextPageUrl: null,
    previousPageUrl: null
  })
  const [page, setPage] = useState<string|null>('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<any>()
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadPage()
  }, [page])

  const loadPage = async () => {
    setIsLoading(true)
    await getActiveConversations(page).then((conversations) => {
      //console.log(conversations)
      setActiveConversations(conversations.instances)
      let pages: PageUrls = {
        nextPageUrl: null,
        previousPageUrl: null
      };
      if (conversations?.hasOwnProperty('nextPageUrl')) {
        pages.nextPageUrl = conversations?.nextPageUrl
      }
      if (conversations?.hasOwnProperty('previousPageUrl')) {
        pages.previousPageUrl = conversations?.previousPageUrl
      }
      setMeta(pages)

    }).then(() => setIsLoading(false))
  }

  const reloadPage = () => {
    setPage('')
    loadPage()
    setCurrentPage(1);
  }

  const goToNextPage = (event : any) => {
    setPage(meta.nextPageUrl);

    let uri = new URL(meta.nextPageUrl as string);
    let p   = uri.searchParams.get('Page');

    setCurrentPage(Number(p) + 1);
    
    event.preventDefault();
  };

  const goToPreviousPage = (event : any) => {
    setPage(meta.previousPageUrl);

    let uri = new URL(meta.previousPageUrl as string);
    let p = uri.searchParams.get('Page');

    setCurrentPage(Number(p) + 1);
    
    event.preventDefault();
  };

  return (
    <Box overflowY="auto" minHeight="100%" width={"100%"} padding={"space60"} verticalAlign={"top"}>
      <Box marginBottom={"space30"} display="flex" columnGap={"space30"} alignItems={"center"} verticalAlign={"middle"}>
        <Heading as="h3" variant="heading30" marginBottom='space0'>{_l('Active Conversations')}</Heading>
        <Button variant="primary" onClick={() => reloadPage()} size='small'>
          <Icon icon="Loading"  /> {_l('Refresh')}
        </Button>
      </Box>
      
      <Table>
        <THead>
          <Tr>
            <Th>{_l('Address')}</Th>
            <Th>{_l('Start Date')}</Th>
            <Th>{_l('Actions')}</Th>
          </Tr>
        </THead>

        {!isLoading && activeConversations.length > 0 && (
          <TBody>
            {activeConversations.map((conversation: any, index) => (
              <Tr key={conversation.sid}>
                <Td>{conversation.sid}</Td>
                <Td>
                  <Box display="flex" alignItems="center">
                    {diffDays(conversation.dateCreated) > 2 && diffDays(conversation.dateCreated) < 3 && (
                      <TimeIcon
                        color="colorTextIcon"
                        decorative={false}
                        title="inactive" />
                    )}

                    {diffDays(conversation.dateCreated) > 3 && diffDays(conversation.dateCreated) < 6 && (
                      <WarningIcon
                        color="colorTextIconWarning"
                        decorative={false}
                        title="risky" />
                    )}

                    {diffDays(conversation.dateCreated) > 6 && (
                      <ErrorIcon
                        color="colorTextIconError"
                        decorative={false}
                        title="error" />
                    )}

                    <Text as="p" marginLeft="space20">{humanReadableDate(language, conversation.dateCreated)}</Text>
                  </Box></Td>
                <Td>
                  <ButtonGroup>
                    <Button variant="primary" onClick={() => {
                      setSelectedConversation(conversation.sid)
                    }}>{_l('Conversation details')}</Button>

                    <CloseActiveConversationButton manager={manager} conversationSid={conversation.sid} closedCallback={() => {
                      setActiveConversations(activeConversations.filter((a: any) => a.sid !== conversation.sid))
                    }} />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </TBody>
        )}

        {isLoading && (
          <TBody>
            <Tr>
              <Td><SkeletonLoader width="50%" /></Td>
              <Td><SkeletonLoader width="35%" /></Td>
              <Td><SkeletonLoader width="35%" /></Td>
            </Tr>
            <Tr>
              <Td><SkeletonLoader width="35%" /></Td>
              <Td><SkeletonLoader width="35%" /></Td>
              <Td><SkeletonLoader width="35%" /></Td>
            </Tr>
            <Tr>
              <Td><SkeletonLoader width="50%" /></Td>
              <Td><SkeletonLoader width="35%" /></Td>
              <Td><SkeletonLoader width="35%" /></Td>
            </Tr>
            <Tr>
              <Td><SkeletonLoader width="35%" /></Td>
              <Td><SkeletonLoader width="35%" /></Td>
              <Td><SkeletonLoader width="35%" /></Td>
            </Tr>
          </TBody>
        )}

        {!isLoading && meta !== null && (
            <TFoot>
              <Tr>
              <Td colSpan={3} textAlign="center">
                <Pagination label="default pagination navigation">
                  <PaginationItems>
                    <PaginationArrow label="Go to previous page" variant="back" onClick={goToPreviousPage} disabled={meta.previousPageUrl === null} />
                    <PaginationLabel>
                      {_l('Page')} {currentPage}
                    </PaginationLabel>
                    <PaginationArrow label="Go to next page" variant="forward" onClick={goToNextPage} disabled={meta.nextPageUrl === null} />
                  </PaginationItems>
                </Pagination>
                </Td>
              </Tr>
            </TFoot>
        )}
        
      </Table>
      <ConversationDetails manager={manager} conversationSid={selectedConversation} closeCallback={() => { 
        setActiveConversations(activeConversations.filter((a: any) => a.sid !== selectedConversation))
        setSelectedConversation(undefined)
      }} />
    </Box>
  );
};

export default ActiveConversationsList;
