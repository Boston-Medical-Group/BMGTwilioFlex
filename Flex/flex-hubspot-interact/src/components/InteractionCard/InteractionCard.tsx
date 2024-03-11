import React, { useEffect, useCallback, useState } from 'react';
import * as Flex from "@twilio/flex-ui";
import { CustomizationProvider } from '@twilio-paste/core/customization';
import { Theme } from '@twilio-paste/core/theme';
import { Box, Card, Heading, Paragraph, Button } from '@twilio-paste/core';
import { FaCalendar, FaPhoneAlt, FaSms, FaWhatsapp } from 'react-icons/fa';
import useApi from '../../hooks/useApi';
import SendSmsModal from './SendSmsModal';
import SendWAModal from './SendWAModal';
import { HubspotContact, HubspotDeal } from 'Types';
// @ts-ignore
import { fullName } from '../../utils/helpers';


type Props = {
  manager: Flex.Manager
  contact: HubspotContact
  deal?: HubspotDeal
  callHandler: (event: any) => void
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

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const InteractionCard = ({manager, contact, deal, callHandler} : Props) => {
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
    const parseBool = (val : string | boolean) => val === true || val === "true"
    let dnc = typeof contact.donotcall === 'string' ? parseBool(contact.donotcall.toLowerCase()) : contact.donotcall;
    setDoNotCall(dnc ? true : false)
    
    let dnw = typeof contact.whatsappoptout === 'string' ? parseBool(contact.whatsappoptout.toLowerCase()) : contact.whatsappoptout;
    setDoNotWhatsapp(dnw ? true : false)

  }, [contact])

  useEffect(() => {
    Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

    return () => {
      Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
    }
  }, [afterSetActivityListener])

  const sendSmsHandler = useCallback((contact: HubspotContact, deal?: HubspotDeal) => {
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

  type CountryMap = {
    [key: string]: string
  }
  const sendWAHandler = useCallback((contact: HubspotContact, deal?: HubspotDeal) => {
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
    

    // @todo corregir telefono e164
    startOutboundConversation({
        To: `whatsapp:${ contact.phone }`,
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
        <SendSmsModal selectedContact={selectedSmsContact} dealId={deal?.hs_object_id} manager={manager} handleClose={handleCloseModel} />
        <SendWAModal selectedContact={selectedWAContact} dealId={deal?.hs_object_id} manager={manager} handleClose={handleCloseModel} />
        <Box paddingTop="space60">
        <Card>
          <Heading as="h2" variant="heading20">Interactuar con {fullName(contact)}</Heading>
          <Paragraph>
            Seleccione el método de interacción con el contacto seleccionado.
            </Paragraph>
            {doNotCall && (
              <Paragraph>
                El contacto está marcado como "No Llamar".
              </Paragraph>
            )}
            <Box display="flex"
              rowGap="space60"
              flexWrap="wrap"
              justifyContent="space-between"
              flexDirection="column"
            >
              <Button variant="primary" title={doNotCall ? 'No Llamar' : (actionDisabled ? "To make a call, please change your status from 'Offline'" : "Make a call")} disabled={actionDisabled || doNotCall} onClick={callHandler}><FaPhoneAlt /> Call</Button>
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
                <Button variant="primary" disabled={actionDisabled} fullWidth onClick={() => sendSmsHandler(contact, deal)}><FaSms /> SMS</Button>
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
                  title={doNotWhatsapp ? 'No enviar WhatsApp' : (actionDisabled ? "Para enviar mensajes de WhatsApp, por favor cambie su estado distinto de 'Offline'" : "Iniciar conversación de WhatsApp")}
                  disabled={actionDisabled || doNotWhatsapp}
                  onClick={() => sendWAHandler(contact, deal)}
                ><FaWhatsapp /> WhatsApp</Button>
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
                  <Button disabled={actionDisabled} variant="primary" onClick={sendCalendarHandler} fullWidth><FaCalendar /> Cita</Button>
                </CustomizationProvider>
              )}
          </Box>
          </Card>
        </Box>
      </>
    </Theme.Provider>
  );
};

export default InteractionCard;
