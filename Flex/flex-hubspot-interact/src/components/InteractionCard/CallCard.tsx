import React, { useEffect, useCallback, useState } from 'react';
import * as Flex from "@twilio/flex-ui";
import { Theme } from '@twilio-paste/core/theme';
import { Box, Card, Heading, Select, Option, Stack, Label, Button } from '@twilio-paste/core';
import { FaPhoneAlt } from 'react-icons/fa';
import { Workspace, TaskQueue } from "twilio-taskrouter";
import { HubspotContact, HubspotDeal } from '../../Types';
import { fullName } from '../../utils/helpers';

const { FLEX_APP_OUTBOUND_WORKFLOW_SID, FLEX_APP_OUTBOUND_QUEUE_SID } = process.env;

type Props = {
  contact: HubspotContact
  deal?: HubspotDeal
  manager: Flex.Manager
}

type PhonesList = Array<{
  phone: string
  obfuscated: string
}>

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const CallCard = ({ manager, contact, deal } : Props) => {
  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);
  const [queues, setQueues] = useState<Array<TaskQueue>>([]);
  const [defaultQueue] = useState<string>(manager.workerClient?.attributes?.last_used_queue ?? FLEX_APP_OUTBOUND_QUEUE_SID as string);
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  const [selectedPhone, setSelectedPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false)
  const [doNotCall, setDoNotCall] = useState(true);
  const [phonesList, setPhonesList] = useState<PhonesList>([]);

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
      console.log('DO NOT CALL THIS CONTACT')
    } else {
      setDoNotCall(false)
    }
  }, [contact])

  useEffect(() => {
    setSelectedQueue(defaultQueue);
    setSelectedPhone(contact.phone as string);
    const workspaceClient = manager.workspaceClient as Workspace
    workspaceClient.fetchTaskQueues()
      .then((queues) => {
        let taskQueues : Array<TaskQueue> = [];
        queues.forEach((value) => taskQueues.push(value))
        setQueues(taskQueues)
      })
  }, []);

  useEffect(() => {
    Flex.Actions.addListener("afterSetActivity", afterSetActivityListener);

    return () => {
      Flex.Actions.removeListener("afterSetActivity", afterSetActivityListener)
    }
  }, [afterSetActivityListener])

  const handleSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQueue(event.target.value);
  }, [])

  const handlePhoneChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPhone(event.target.value);
  }, [])

  const initiateCallHandler = useCallback(async () => {
    setIsLoading(true)
    const workerAttributes = manager.workerClient?.attributes
    if (workerAttributes) {
      workerAttributes.last_used_queue = selectedQueue
      await manager.workerClient.setAttributes(workerAttributes)
    }

    Flex.Actions.invokeAction("StartOutboundCall", {
      destination: selectedPhone,
      queueSid: selectedQueue,
      taskAttributes: {
        customerName: `${contact.firstname || ''} ${contact?.lastname || ''}`.trim(),
        name: `${contact.firstname || ''} ${contact?.lastname || ''}`.trim(),
        hubspot_contact_id: contact.hs_object_id,
        hubspot_deal_id: deal?.hs_object_id,
        customers: {
          external_id: contact.hs_object_id,
          phone: contact.phone, // El customer sigue teniendo el telefono de su cuenta pero el destino puede ser un telefono secundario
          email: contact.email
        }
      }
    }).finally(() => setIsLoading(false));
  }, [selectedQueue, selectedPhone]);

  useEffect(() => {
    const obfuscate = (phone: string) => {
      const firstPart = phone.slice(0, -4)
      const lastDigits = phone.slice(-4)
      
      return firstPart.replace(/\d/g, '*') + lastDigits
    }

    if (contact.phone) {
      phonesList.push({
        phone: contact.phone as string,
        obfuscated: obfuscate(contact.phone as string)
      })

      if (contact.numero_de_telefono_adicional_ || contact.numero_de_telefono_adicional) {
        const secondaryPhone = contact.numero_de_telefono_adicional_ ?? contact.numero_de_telefono_adicional
        phonesList.push({
          phone: secondaryPhone as string,
          obfuscated: obfuscate(secondaryPhone as string)
        })
      }
    }
  }, [contact])

  return (
    <Theme.Provider theme="default">
      <>
        <Box paddingTop="space60" marginX="space60">
        <Card>
          <Heading as="h2" variant="heading20">Llamar a {fullName(contact)}</Heading>
          <Box justifyContent="center" alignItems="center" rowGap="space10" marginBottom="space80">
              <Label htmlFor="queue">Seleccione la cola</Label>
              <Select id="queue" value={selectedQueue ?? queues.at(0)?.queueSid} onChange={handleSelectChange}>
                { queues.map((queue : TaskQueue) => (
                  <Option value={queue.queueSid} key={queue.queueSid}>{queue.queueName}</Option>
                )) }
              </Select>
            </Box>
            
            <Box justifyContent="center" alignItems="center" rowGap="space10" marginBottom="space80">
              <Label htmlFor="to">Seleccione télefono a llamar</Label>
              <Select id="to" value={selectedPhone ?? phonesList.at(0)?.phone} onChange={handlePhoneChange}>
                {phonesList.map((phone) => (
                  <Option value={phone.phone} key={phone.phone}>{phone.obfuscated}</Option>
                ))}
              </Select>
            </Box>
          <Stack orientation="horizontal" spacing="space30">
            <Button loading={isLoading} variant="primary" title={doNotCall ? 'No Llamar' : (actionDisabled ? "To make a call, please change your status from 'Offline'" : "Make a call")} disabled={actionDisabled || doNotCall} onClick={() => initiateCallHandler()}><FaPhoneAlt /> Iniciar llamada</Button>
          </Stack>
          </Card>
        </Box>
      </>
    </Theme.Provider>
  );
};

export default CallCard;
