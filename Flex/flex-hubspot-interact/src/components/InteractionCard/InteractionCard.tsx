import React, { useEffect, useCallback, useState } from 'react';
import * as Flex from "@twilio/flex-ui";
import { Theme } from '@twilio-paste/core/theme';
import { Box, Card, Heading, Paragraph, Stack } from '@twilio-paste/core';
import { Button } from '@twilio-paste/core/button';
import { FaCalendar, FaPhoneAlt, FaSms, FaWhatsapp } from 'react-icons/fa';
import useApi from '../../hooks/useApi';
import SendSmsModal from './SendSmsModal';
import SendWAModal from './SendWAModal';
import CallCard from './CallCard';
import { actions, AppState } from '../../states';
import { HubspotContact } from 'Types';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';


type Props = {
  manager: Flex.Manager
}

type Deal = {
  [key: string]: any
};

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const InteractionCard = ({manager} : Props) => {
  const { getDataByContactId, getDataByDealId } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const [contact, setContact] = useState({});
  const [contactId, setContactId] = useState(null);
  const [deal, setDeal] = useState<Deal>({});
  const [dealId, setDealId] = useState(null);
  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);
  const [selectedSmsContact, setSelectedSmsContact] = useState();
  const [selectedWAContact, setSelectedWAContact] = useState();
  const [showCallCard, setShowCallCard] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState<string>('');
  //const [callCard, setCallCard] = useState(false);

  const callCard = useSelector(
    (state: AppState) => {
      return state.interactionCallCardState.interactionCallCard.callCard
    }
  );
  const dispatch = useDispatch();

  const afterSetActivityListener = useCallback((payload) => {
    if (payload.activityAvailable) {
      setActionDisabled(false)
    } else {
      setActionDisabled(true)
    }
  }, []);

  useEffect(() => {
    if (callCard !== undefined && callCard.hasOwnProperty('data')) {
      setContact(callCard.data);
      setShowCallCard(true);
    } else {
      setShowCallCard(false);
    }
  }, [callCard])

  useEffect(() => {
    Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

    return () => {
      Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
    }
  }, [afterSetActivityListener])

  

  useEffect(() => {
    async function receiveMessage(event : { data: any }) {
      // Invoke the Flex Outbound Call Action
      const { data } = event;
      if (data.from === 'FLEX_SCRIPT') {
        //console.log('LOCALDEV', event);
        if (data.actionType === 'gotoInteraction') {
          setShowCallCard(false)
          dispatch(actions.interactionCallCard.setCallCard({}))
          //window.removeEventListener('message', receiveMessage);
          if (data.hasOwnProperty('contact_id')) {
            setContactId(data.contact_id);
            setDealId(null);
          } else if (data.hasOwnProperty('deal_id')) {
            setContactId(null);
            setDealId(data.deal_id);
          }
        }
      }
    }

    window.addEventListener("message", receiveMessage, false);
  }, [])

  useEffect(() => {
    setContact({});
    setCalendarUrl('');
    //setContactId(null);
    //setDealId(null);

    if (!contactId && !dealId) {
      return;
    }

    if (contactId) {
      getDataByContactId({ contact_id: contactId })
        .then(data => {
          setContact(data.properties)
        })
        .catch(() => console.log("Error while fetching data from Hubspot"));
    } else if (dealId) {
      getDataByDealId({ deal_id: dealId })
        .then((data) => {
          setContact(data.properties)
          if (data.deal !== undefined && data.deal !== null) {
            setDeal(data.deal.properties)
          }
        })
        .catch(() => console.log("Error while fetching data from Hubspot"));
    }
  }, [contactId, dealId])

  useEffect(() => {
    setCalendarUrl(calendar(contact))
  }, [contact, deal])


  const fullName = (contact : HubspotContact) => {
    let fullName = `${contact.firstname ?? ''} ${contact.lastname ?? ''}`;
    if (fullName.trim() == '') {
      return 'Unknown name';
    }

    return fullName;
  }

  const initiateCallHandler = useCallback((data) => {
    dispatch(actions.interactionCallCard.setCallCard({
      data: data,
      dealId: dealId ?? null
    }))
  }, []);

  const sendSmsHandler = React.useCallback((data) => {
    setSelectedSmsContact(data);
  }, []);

  const sendWAHandler = React.useCallback((data) => {
    setSelectedWAContact(data);
  }, []);

  const handleCloseModel = React.useCallback(() => {
    setSelectedSmsContact(undefined);
    setSelectedWAContact(undefined);
  }, []);

  const sendCalendarHandler = useCallback(() => {
    window.open(calendarUrl, '_blank');
  }, [calendarUrl])

  const calendar = (data : any) => {
    if (actionDisabled) {
      return '#';
    }

    if (process.env.FLEX_APP_CALENDAR_URL_FIELD != undefined) {
      const myVar = process.env.FLEX_APP_CALENDAR_URL_FIELD;

      if (deal && typeof deal === 'object') {
        if (deal.hasOwnProperty(myVar)) {
          return deal[myVar] ?? '';
        }
      }
      
      return data[myVar] ?? '';
    }

    return '';
  }

  if (!contact.hasOwnProperty('hs_object_id')) {
    return null;
  }

  if (showCallCard) {
    return (
      <CallCard manager={manager} />
    )
  }

  return (
    <Theme.Provider theme="default">
      <>
        <SendSmsModal selectedContact={selectedSmsContact} dealId={dealId} manager={manager} handleClose={handleCloseModel} />
        <SendWAModal selectedContact={selectedWAContact} dealId={dealId} manager={manager} handleClose={handleCloseModel} />
        <Box paddingTop="space60">
        <Card>
          <Heading as="h2" variant="heading20">Interactuar con {fullName(contact)}</Heading>
          <Paragraph>
            Seleccione el método de interacción con el contacto seleccionado.
            </Paragraph>
          <Box display="flex" columnGap="space30" rowGap="space30" flexWrap="wrap">
            <Button variant="primary" title={actionDisabled ? "To make a call, please change your status from 'Offline'" : "Make a call"} disabled={actionDisabled} onClick={() => initiateCallHandler(contact)}><FaPhoneAlt /> Call</Button>
              <Button variant="primary" title={actionDisabled ? "To send a SMS, please change your status from 'Offline'" : "Send a SMS"} disabled={actionDisabled} onClick={() => sendSmsHandler(contact)}><FaSms /> SMS</Button>
              <Button variant="primary" title={actionDisabled ? "To send a WhatsApp, please change your status from 'Offline'" : "Send a WhatsApp"} disabled={actionDisabled} onClick={() => sendWAHandler(contact)}><FaWhatsapp /> WhatsApp</Button>
              {calendarUrl !== '' && <Button variant="primary" title="Schedule a new appointment" onClick={sendCalendarHandler}><FaCalendar /> Cita</Button>}
          </Box>
          </Card>
        </Box>
      </>
    </Theme.Provider>
  );
};

export default InteractionCard;
