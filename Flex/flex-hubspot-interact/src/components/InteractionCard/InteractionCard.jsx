import React, { useEffect, useCallback, useState } from 'react';
import * as Flex from "@twilio/flex-ui";
import { Theme } from '@twilio-paste/core/theme';
import { Box, Card, Heading, Paragraph, Stack } from '@twilio-paste/core';
import { Button } from '@twilio-paste/core/button';
import { FaCalendar, FaPhoneAlt, FaSms, FaWhatsapp } from 'react-icons/fa';
import useApi from '../../hooks/useApi';
import SendSmsModal from './SendSmsModal';
import SendWAModal from './SendWAModal';

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 *
 * @param {Flex.Manager} manager - an object representing the task manager
 * @return {JSX.Element|null} - the rendered JSX element or null if isOpen is false
 */
const InteractionCard = ({manager}) => {
  const { getDataByContactId, getDataByDealId } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const [contact, setContact] = useState({});
  const [contactId, setContactId] = useState(null);
  const [deal, setDeal] = useState({});
  const [dealId, setDealId] = useState(null);
  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);
  const [selectedSmsContact, setSelectedSmsContact] = useState();
  const [selectedWAContact, setSelectedWAContact] = useState();

  const afterSetActivityListener = useCallback((payload) => {
    if (payload.activityAvailable) {
      setActionDisabled(false)
    } else {
      setActionDisabled(true)
    }
  }, []);

  useEffect(() => {
    Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

    return () => {
      Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
    }
  }, [afterSetActivityListener])

  

  useEffect(() => {
    async function receiveMessage(event) {
      // Invoke the Flex Outbound Call Action
      const { data } = event;
      if (data.from === 'FLEX_SCRIPT') {
        //console.log('LOCALDEV', event);
        if (data.actionType === 'gotoInteraction') {
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
    //setContactId(null);
    //setDealId(null);

    if (!contactId && !dealId) {
      return;
    }

    if (contactId) {
      getDataByContactId({ contact_id: contactId })
        .then(data => setContact(data.properties))
        .catch(() => setError("Error while fetching data from Hubspot"));
    } else if (dealId) {
      getDataByDealId({ deal_id: dealId })
        .then((data) => {
          setContact(data.properties)
          if (data.deal !== undefined && data.deal !== null) {
            setDeal(data.deal.properties)
          }
        })
        .catch(() => setError("Error while fetching data from Hubspot"));
    }
  }, [contactId, dealId])


  const fullName = (contact) => {
    let fullName = `${contact.firstname ?? ''} ${contact.lastname ?? ''}`;
    if (fullName.trim() == '') {
      return 'Unknown name';
    }

    return fullName;
  }

  const initiateCallHandler = useCallback((data) => {
    Flex.Actions.invokeAction("StartOutboundCall", {
      destination: data.phone,
      taskAttributes: {
        name: `${data.firstname || ''} ${data.lastname || ''}`.trim(),
        hubspot_contact_id: data.hs_object_id,
        hubspot_deal_id: dealId ?? null
      }
    });
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

  const sendCalendarHandler = useCallback((data) => {
    window.open(calendar(data), '_blank');
  })

  const calendar = (data) => {
    if (actionDisabled) {
      return '#';
    }

    if (process.env.FLEX_APP_CALENDAR_URL_FIELD != undefined) {
      const myVar = process.env.FLEX_APP_CALENDAR_URL_FIELD;

      if (deal && deal.trim() !== '') {
        console.log('CalendarURL loaded from Deal');
        return deal[myVar] ?? null;
      }
      
      console.log('CalendarURL loaded from Contact');
      return data[myVar] ?? null;
    }

    return null;
  }

  if (!contact.hasOwnProperty('hs_object_id')) {
    return null;
  }

  console.log('DEALID', dealId);

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
          <Stack orientation="horizontal" spacing="space30" style={{ 'row-gap': '10px' }}>
            <Button variant="primary" title={actionDisabled ? "To make a call, please change your status from 'Offline'" : "Make a call"} disabled={actionDisabled} onClick={() => initiateCallHandler(contact)}><FaPhoneAlt /> Call</Button>
              <Button variant="primary" title={actionDisabled ? "To send a SMS, please change your status from 'Offline'" : "Send a SMS"} disabled={actionDisabled} onClick={() => sendSmsHandler(contact)}><FaSms /> SMS</Button>
              <Button variant="primary" title={actionDisabled ? "To send a WhatsApp, please change your status from 'Offline'" : "Send a WhatsApp"} disabled={actionDisabled} onClick={() => sendWAHandler(contact)}><FaWhatsapp /> WhatsApp</Button>
              {calendar(contact) && <Button variant="primary" title="Schedule a new appointment" onClick={() => sendCalendarHandler(contact)}><FaCalendar /> Cita</Button>}
          </Stack>
          </Card>
        </Box>
      </>
    </Theme.Provider>
  );
};

export default InteractionCard;
