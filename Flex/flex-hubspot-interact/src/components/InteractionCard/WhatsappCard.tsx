import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Flex from "@twilio/flex-ui";
import { Box, Heading, Select, Option, Stack, Label, Button } from '@twilio-paste/core';
import { FaWhatsapp } from 'react-icons/fa';
import { HubspotContact, HubspotDeal } from '../../Types';
import { fullName } from '../../utils/helpers';
import useLang from '../../hooks/useLang';

type Props = {
  manager: Flex.Manager 
  sendHandler: (phone: string) => Promise<void>
  interactionHandler: () => void
}

type PhonesList = Array<{
  phone: string
  obfuscated: string
}>

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const CallCard = ({ manager, sendHandler, interactionHandler }: Props) => {
  const { _l } = useLang()
  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);
  const [selectedPhone, setSelectedPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false)
  const [doNotCall, setDoNotCall] = useState(true);
  const [phonesList, setPhonesList] = useState<PhonesList>([]);

  const { contact, deal } = useSelector(
    (state: any) => ({
      contact: state.hubspotInteraction.interaction.contact,
      deal: state.hubspotInteraction.interaction.deal
    })
  );

  const afterSetActivityListener = useCallback((payload) => {
    if (payload.activityAvailable) {
      setActionDisabled(false)
    } else {
      setActionDisabled(true)
    }
  }, []);

  /** DO NOT CALL */
  useEffect(() => {
    const parseBool = (val: string | boolean) => val === true || val === "true"
    let dnc = typeof contact.donotcall === 'string' ? parseBool(contact.donotcall.toLowerCase()) : contact.donotcall;
    if (dnc) {
      setDoNotCall(true)
    } else {
      setDoNotCall(false)
    }
  }, [contact])

  useEffect(() => {
    setSelectedPhone((contact.hs_whatsapp_phone_number ?? contact.phone) as string);
  }, []);

  useEffect(() => {
    Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

    return () => {
      Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
    }
  }, [afterSetActivityListener])

  const handlePhoneChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPhone(event.target.value);
  }, [])

  const initiateSendHandler = async () => {
    setIsLoading(true)

    await sendHandler(selectedPhone).finally(() => {
      interactionHandler()
      setIsLoading(false)
    });
  }

  useEffect(() => {
    console.log('CONTACT WAS UPDATED OUTSIDE', contact)
  }, [sendHandler])

  useEffect(() => {
    const obfuscate = (phone: string) => {
      const firstPart = phone.slice(0, -4)
      const lastDigits = phone.slice(-4)
      
      return firstPart.replace(/\d/g, '*') + lastDigits
    }

    let phones: Array<{ phone: string, obfuscated: string }> = []
    const injectPhone = (search: string) => {
      if (phones.findIndex((phone) => phone.phone === search) === -1) {
        phones.push({
          phone: search as string,
          obfuscated: obfuscate(search as string)
        })
      }
    }
    
    if (contact.hs_whatsapp_phone_number) {
      injectPhone(contact.hs_whatsapp_phone_number)
    }
  
    if (contact.phone) {
      injectPhone(contact.phone)
    }

    setPhonesList(phones)
  }, [contact])

  return (
      <>
        <Box paddingTop="space60" marginX="space60">
          <Heading as="h4" variant="heading40">{_l('Start conversation with %')} {fullName(contact)}</Heading>
          <Box justifyContent="center" alignItems="center" rowGap="space10" marginBottom="space80">
          <Label htmlFor="to">{_l('Select Whatsapp address to start a conversation')}</Label>
              <Select id="to" value={selectedPhone ?? phonesList.at(0)?.phone} onChange={handlePhoneChange}>
                {phonesList.map((phone) => (
                  <Option value={phone.phone} key={phone.phone}>{phone.obfuscated}</Option>
                ))}
              </Select>
            </Box>
          <Stack orientation="horizontal" spacing="space30">
          <Button loading={isLoading} variant="primary" title={doNotCall ? _l('Do no whatsapp') : (actionDisabled ? _l('To start a whatsapp conversation, please change your status different from \'Offline\'') : _l('Start conversation'))} disabled={actionDisabled || doNotCall} onClick={initiateSendHandler}><FaWhatsapp /> {_l('Start conversation')}</Button>
          </Stack>
        </Box>
      </>
  );
};

export default CallCard;
