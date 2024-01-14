import React, { useEffect, useCallback, useState } from 'react';
import * as Flex from "@twilio/flex-ui";
import { Theme } from '@twilio-paste/core/theme';
import { Box, Card, Heading, Select, Option, Stack, Label, Button } from '@twilio-paste/core';
import { FaPhoneAlt } from 'react-icons/fa';
import { Workspace, TaskQueue } from "twilio-taskrouter";
import { CallCardType, HubspotContact } from '../../Types';
import { actions, AppState } from '../../states';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';

const { FLEX_APP_OUTBOUND_WORKFLOW_SID, FLEX_APP_OUTBOUND_QUEUE_SID } = process.env;

type Props = {
  manager: Flex.Manager
}

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 */
const CallCard = ({ manager } : Props) => {
  const [actionDisabled, setActionDisabled] = useState(manager.workerClient ? !manager.workerClient.activity.available : true);
  const [queues, setQueues] = useState<Array<TaskQueue>>([]);
  const [defaultQueue] = useState<string>(FLEX_APP_OUTBOUND_QUEUE_SID as string);
  const [selectedQueue, setSelectedQueue] = useState<string>('');

  const callCard = useSelector(
    (state: AppState) => state.interactionCallCardState.interactionCallCard.callCard
  );

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


  const fullName = (contact : HubspotContact) => {
    let fullName = `${contact.firstname ?? ''} ${contact.lastname ?? ''}`;
    if (fullName.trim() == '') {
      return 'Unknown name';
    }

    return fullName;
  }

  const initiateCallHandler = useCallback(() => {
    Flex.Actions.invokeAction("StartOutboundCall", {
      destination: callCard?.data?.phone,
      queueSid: selectedQueue,
      taskAttributes: {
        name: `${callCard?.data?.firstname || ''} ${callCard?.data?.lastname || ''}`.trim(),
        hubspot_contact_id: callCard?.data?.hs_object_id,
        hubspot_deal_id: callCard?.dealId ?? null
      }
    });
  }, [selectedQueue]);

  return (
    <Theme.Provider theme="default">
      <>
        <Box paddingTop="space60" marginX="space60">
        <Card>
          <Heading as="h2" variant="heading20">Llamar a {fullName(callCard?.data as HubspotContact)}</Heading>
          <Box justifyContent="center" alignItems="center" rowGap="space10" marginBottom="space80">
              <Label htmlFor="queue">Seleccione la cola</Label>
              <Select id="queue" value={selectedQueue ?? queues.at(0)?.queueSid} onChange={handleSelectChange}>
                { queues.map((queue : TaskQueue) => (
                  <Option value={queue.queueSid} key={queue.queueSid}>{queue.queueName}</Option>
                )) }
              </Select>
          </Box>
          <Stack orientation="horizontal" spacing="space30">
            <Button variant="primary" title={actionDisabled ? "To make a call, please change your status from 'Offline'" : "Make a call"} disabled={actionDisabled} onClick={() => initiateCallHandler()}><FaPhoneAlt /> Iniciar llamada</Button>
          </Stack>
          </Card>
        </Box>
      </>
    </Theme.Provider>
  );
};

export default CallCard;
