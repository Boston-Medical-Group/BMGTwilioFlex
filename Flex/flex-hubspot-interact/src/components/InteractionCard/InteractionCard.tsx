import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Flex from "@twilio/flex-ui";
import { Notifications } from "@twilio/flex-ui";
import { CustomizationProvider } from '@twilio-paste/core/customization';
import { Theme } from '@twilio-paste/core/theme';
import { Box, Card, Heading, Paragraph, Button } from '@twilio-paste/core';
import { FaCalendar, FaPhoneAlt, FaSms, FaWhatsapp } from 'react-icons/fa';
import useApi from '../../hooks/useApi';
import SendSmsModal from './SendSmsModal';
import SendWAModal from './SendWAModal';
import { HubspotContact, HubspotDeal } from 'Types';
// @ts-ignore
import { fullName, getStrings } from '../../utils/helpers';
import useLang from '../../hooks/useLang';


type Props = {
  manager: Flex.Manager
  contact: HubspotContact
  deal?: HubspotDeal
  callHandler: (event: any) => void
  interactionHandler: any
}

const disabledButtonStyles = {
  ':disabled': {
    backgroundColor: 'colorBackgroundStrong',
    borderColor: 'colorBorder',
    boxShadow: 'none',
  },
  ':hover:disabled': {
    color: 'colorTextInverse',
    backgroundColor: 'colorBackgroundStrong',
    borderColor: 'colorBorder',
    boxShadow: 'none',
  }
}

Flex.Notifications.registerNotification({
  id: "contact_not_found_on_hubpost",
  content: 'Error',
  type: Flex.NotificationType.error
});

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const InteractionCard = ({ manager, contact, deal, callHandler, interactionHandler }: Props) => {
  const { _l } = useLang()
  const { startOutboundConversation } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);
  const [selectedSmsContact, setSelectedSmsContact] = useState<HubspotContact>();
  const [selectedWAContact, setSelectedWAContact] = useState<HubspotContact>();
  const [doNotCall, setDoNotCall] = useState(true);
  const [doNotWhatsapp, setDoNotWhatsapp] = useState(true);

  const afterSetActivityListener = useCallback((payload) => {
    if (payload.activityAvailable) {
      setActionDisabled(false)
    } else {
      setActionDisabled(true)
    }
  }, []);

  /** DO NOT CALL & DO NOT WHATSAPP */
  useEffect(() => {
    const parseBool = (val: string | boolean) => val === true || val === "true"
    if (typeof contact === 'object') {
      let dnc = typeof contact.donotcall === 'string' ? parseBool(contact.donotcall.toLowerCase()) : contact.donotcall;
      setDoNotCall(dnc ? true : false)
      
      let dnw = typeof contact?.whatsappoptout === 'string' ? parseBool(contact?.whatsappoptout.toLowerCase()) : contact.whatsappoptout;
      setDoNotWhatsapp(dnw ? true : false)
    }

  }, [contact])

  useEffect(() => {
    Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

    return () => {
      Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
    }
  }, [afterSetActivityListener])

  const sendSmsHandler = useCallback(async (contact: HubspotContact, deal?: HubspotDeal) => {
    await sendHandler('sms', contact, deal)
  }, []);

  type CountryMap = {
    [key: string]: string
  }

  const sendHandler = useCallback(async (channel: string,contact: HubspotContact, deal?: HubspotDeal) => {
    if (contact.country) {
      const countryMap: CountryMap = {
        CO: '+57',
        PE: '+51',
        AR: '+54',
        ES: '+34',
        MX: '+52',
        EC: '+593',
        BR: '+55',
      }

      if (contact.phone && !contact.phone.startsWith('+') && countryMap.hasOwnProperty(contact.country)) {
        const currentCode: string = countryMap[contact.country];
        // if contact.phone doesn't have country code, add it
        if (contact.phone && !contact.phone.startsWith(currentCode)) {
          contact.phone = `${currentCode}${contact.phone}`;
        }
      }
    }

    // @todo Enviar mensajes de hubspot con interaction 
    // @todo corregir telefono e164
    const result = await startOutboundConversation({
      To: channel === 'whatsapp' ? `whatsapp:${contact.phone}` : contact.phone,
      customerName: `${contact.firstname || ''} ${contact.lastname || ''}`.trim(),
      WorkerFriendlyName: manager.workerClient ? manager.workerClient.name : '',
      KnownAgentRoutingFlag: false,
      OpenChatFlag: true,
      hubspotContact: contact,
      hubspot_contact_id: contact.hs_object_id,
      hubspot_deal_id: deal?.hs_object_id ?? null
    })

    interactionHandler()

    const isSuccess = result.success
    if (!isSuccess) {
      const errorCode = result.errorMessage
      Notifications.showNotification(errorCode, { conversationSid: result.conversationSid});
    }
  }, [])

  const sendWAHandler = useCallback(async (contact: HubspotContact, deal?: HubspotDeal) => {
    await sendHandler('whatsapp', contact, deal)
  }, []);

  const handleCloseModel = React.useCallback(() => {
    setSelectedSmsContact(undefined);
    setSelectedWAContact(undefined);
  }, []);

  const sendCalendarHandler = useCallback(() => {
    interactionHandler()
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

  if (typeof contact !== 'object' || contact === null || !contact.hasOwnProperty('hs_object_id')) {
    let notification = Flex.Notifications.registeredNotifications.get('contact_not_found_on_hubpost')
    if (notification) {
      notification.content = _l('Contact not found on HubSpot')
    }
    Flex.Notifications.showNotification("contact_not_found_on_hubpost", undefined);
    return null;
  }

  return (
    <Theme.Provider theme="default">
      <>
        <SendSmsModal selectedContact={selectedSmsContact} dealId={deal?.hs_object_id} manager={manager} handleClose={handleCloseModel} />
        <SendWAModal selectedContact={selectedWAContact} dealId={deal?.hs_object_id} manager={manager} handleClose={handleCloseModel} />
        <Box paddingTop="space60">
          <Heading as="h4" variant="heading40">{_l('Interact with %')} {fullName(contact)}</Heading>
          <Paragraph>
            {_l('Select interaction method')}
            </Paragraph>
            {doNotCall && (
              <Paragraph>
                {_l('Contact marked as "Don\'t call"')}
              </Paragraph>
            )}
            <Box display="flex"
              rowGap="space60"
              flexWrap="wrap"
              justifyContent="space-between"
              flexDirection="column"
              margin="auto"
              maxWidth="300px">
            <Button variant="primary" title={doNotCall ? _l('Do not call') : (actionDisabled ? _l('To make a call, please change your status different from \'Offline\'') : _l('Make a call'))} disabled={actionDisabled || doNotCall} onClick={callHandler}><FaPhoneAlt /> {_l('Start call')}</Button>
              <CustomizationProvider
                elements={{
                  BUTTON: {
                    backgroundColor: 'colorBackgroundInverse',
                    boxShadow: 'shadowBorderInverseWeakest',
                    ...disabledButtonStyles,
                    ':hover': {
                      color: 'colorTextPrimaryStrongest',
                      borderColor: 'colorBorderInverse',
                      boxShadow: 'shadowBorderInverseWeakest',
                    },
                    
                  },
                }}
              >
                <Button variant="primary" disabled={actionDisabled} fullWidth onClick={() => sendSmsHandler(contact, deal)}><FaSms /> {_l('SMS')}</Button>
              </CustomizationProvider>
              <CustomizationProvider
                elements={{
                  BUTTON: {
                    backgroundColor: 'colorBackgroundSuccess',
                    borderColor: 'colorBorderSuccess',
                    boxShadow: 'none',
                    ...disabledButtonStyles,
                    ':hover': {
                      borderColor: 'colorBorderSuccess',
                      color: 'colorTextSuccess',
                      boxShadow: 'shadowBorderSuccessWeaker',
                    }
                  },
                }}
              >
                <Button variant="primary"
                  fullWidth
                title={doNotWhatsapp ? _l('Do not WhatsApp') : (actionDisabled ? _l('To start a WhatsApp conversation, please change your status different from \'Offline\'') : _l('Start WhatsApp conversation'))}
                  disabled={actionDisabled || doNotWhatsapp}
                  onClick={() => sendWAHandler(contact, deal)}
              ><FaWhatsapp /> {_l('WhatsApp')}</Button>
              </CustomizationProvider>

              {calendar() !== '' && (
                <CustomizationProvider
                  elements={{
                    BUTTON: {
                      backgroundColor: 'colorBackgroundWarning',
                      borderColor: 'colorBorderWarning',
                      boxShadow: 'shadowBorderWarningWeaker',
                      ...disabledButtonStyles,
                      ':hover': {
                        borderColor: 'colorBorderWarning',
                        color: 'colorTextWarning',
                        boxShadow: 'shadowBorderWarningWeaker',
                      }
                    },
                  }}
                >
                <Button disabled={actionDisabled} variant="primary" onClick={sendCalendarHandler} fullWidth><FaCalendar /> {_l('Appointment')}</Button>
                </CustomizationProvider>
              )}
          </Box>
        </Box>
      </>
    </Theme.Provider>
  );
};

export default InteractionCard;
