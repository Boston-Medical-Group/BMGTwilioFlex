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

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const CallCard = ({ manager, contact, deal } : Props) => {
  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);
  const [queues, setQueues] = useState<Array<TaskQueue>>([]);
  const [defaultQueue] = useState<string>(manager.workerClient?.attributes?.last_used_queue ?? FLEX_APP_OUTBOUND_QUEUE_SID as string);
  const [selectedQueue, setSelectedQueue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false)

  const afterSetActivityListener = useCallback((payload) => {
    if (payload.activityAvailable) {
      setActionDisabled(false)
    } else {
      setActionDisabled(true)
    }
  }, []);

  useEffect(() => {
    setSelectedQueue(defaultQueue);
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

  const initiateCallHandler = useCallback(async () => {
    setIsLoading(true)
    const workerAttributes = manager.workerClient?.attributes
    if (workerAttributes) {
      workerAttributes.last_used_queue = selectedQueue
      await manager.workerClient.setAttributes(workerAttributes)
    }

    Flex.Actions.invokeAction("StartOutboundCall", {
      destination: contact.phone,
      queueSid: selectedQueue,
      taskAttributes: {
        customerName: `${contact.firstname || ''} ${contact?.lastname || ''}`.trim(),
        name: `${contact.firstname || ''} ${contact?.lastname || ''}`.trim(),
        hubspot_contact_id: contact.hs_object_id,
        hubspot_deal_id: deal?.hs_object_id,
        customers: {
          external_id: contact.hs_object_id,
          phone: contact.phone,
          email: contact.email
        }
      }
    }).finally(() => setIsLoading(false));
  }, [selectedQueue]);

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
          <Stack orientation="horizontal" spacing="space30">
            <Button loading={isLoading} variant="primary" title={actionDisabled ? "To make a call, please change your status from 'Offline'" : "Make a call"} disabled={actionDisabled} onClick={() => initiateCallHandler()}><FaPhoneAlt /> Iniciar llamada</Button>
          </Stack>
          </Card>
        </Box>
      </>
    </Theme.Provider>
  );
};

export default CallCard;
