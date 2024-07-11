import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';
import { Reservation, Task } from 'twilio-taskrouter';

const PLUGIN_NAME = 'FlexLogHubspotPlugin';

const DELAY_TO_LOG_CALL_TASKS = 5;

type CancelableTask = { _reservation: Reservation } & ITask

const LogHubspotCall = async (task : CancelableTask, manager : Flex.Manager) => {
  // if task.attributes.hubspot_contact_id is not available end this callback
  //const { postCallLog } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });
  const ownerId = manager.workerClient?.attributes?.hubspot_owner_id ?? null;
 
  const direction = task.attributes.direction.toUpperCase();
  let params: any = {}
  
  let attributes : any = {};
  if (typeof task.attributes === 'string') {
    try {
      attributes = JSON.parse(task.attributes);
    } catch (e) {
      console.log('Error parsing JSON string @ flex-hubspot-log/src/FlexLogHubspotPlugin.tsx@24')
      attributes = {};
    }
  } else {
    attributes = task.attributes;
  }

  if (direction === 'INBOUND') {
    params = {
      //hs_object_id: task.attributes.hubspot_contact_id ?? null,
      hs_call_callee_object_id: attributes.hubspot_contact_id ?? null,
      hubspot_deal_id: attributes.hubspot_deal_id ?? null,
      // convert task.dateCreated Date Object to UTC time and to timestamp
      hs_timestamp: Date.parse(task.dateCreated.toUTCString()),
      // @todo custom disposition codes
      hs_call_body: `NOTA: "${attributes.conversations?.content ?? '--'}"`,
      hs_call_callee_object_type_id: '0-1',
      hs_call_direction: direction,
      //hs_call_disposition: mapOutcome[task.attributes.conversations?.outcome],
      hs_call_duration: task.age * 1000,
      hs_call_from_number: attributes.from,
      hs_call_to_number: attributes.to,
      hs_call_recording_url: attributes.conversations?.segment_link ?? null,
      //hs_call_status: task.status == 'completed' ? 'COMPLETED' : 'CALLING_CRM_USER',
      hs_call_title: attributes.callSid ? attributes.callSid : (attributes.conversationSid ?? null),
      hubspot_owner_id: ownerId,
    }
  } else if (direction === 'OUTBOUND') {
    params = {
      //hs_object_id: task.attributes.hubspot_contact_id ?? null,
      hs_call_callee_object_id: attributes.hubspot_contact_id ?? null,
      hubspot_deal_id: attributes.hubspot_deal_id ?? null,
      // convert task.dateCreated Date Object to UTC time and to timestamp
      hs_timestamp: Date.parse(task.dateCreated.toUTCString()),
      // @todo custom disposition codes
      hs_call_body: `NOTA: "${attributes.conversations?.content ?? '--'}"`,
      hs_call_callee_object_type_id: '0-1',
      hs_call_direction: direction,
      //hs_call_disposition: mapOutcome[task.attributes.conversations?.outcome],
      hs_call_duration: task.age * 1000,
      hs_call_from_number: task.formattedAttributes.from,
      hs_call_to_number: task.formattedAttributes.outbound_to,
      hs_call_recording_url: attributes.conversations?.segment_link ?? null,
      //hs_call_status: task.status == 'completed' ? 'COMPLETED' : 'CALLING_CRM_USER',
      hs_call_title: attributes.callSid ? attributes.callSid : (attributes.conversationSid ?? null),
      hubspot_owner_id: ownerId,
    }
  }

  params.taskAttributes = attributes;

  const mapOutcome: { [key: string]: string } = {
    NO_ANSWER: "73a0d17f-1163-4015-bdd5-ec830791da20",
    BUSY: "9d9162e7-6cf3-4944-bf63-4dff82258764",
    WRONG_NUMBER: "17b47fee-58de-441e-a44c-c6300d46f273",
    LEFT_LIVE_MESSAGE: "a4c4c377-d246-4b32-a13b-75a56a4cd0ff",
    LEFT_VOICEMAIL: "b2cf5968-551e-4856-9783-52b3da59a7d0",
    CONNECTED: "f240bbac-87c9-4f6e-bf70-924b57d47db7"
  }

  const hubspotStatusCodes = [
    'BUSY', 'CALLING_CRM_USER', 'CANCELED', 'COMPLETED', 'CONNECTING', 'FAILED', 'IN_PROGRESS', 'NO_ANSWER', 'QUEUED', 'RINGING'
  ];

  if (task.status == 'canceled') {
    console.log("taskCanceledDebugV2", task, task._reservation?.canceledReasonCode);
    switch (task._reservation?.canceledReasonCode) {
      case 13223:
      case 21211:
        params.hs_call_status = 'FAILED';
        params.hs_call_disposition = mapOutcome['WRONG_NUMBER'];
        console.log("Invalid number!");
        break;
      case 21210:
        params.hs_call_status = 'FAILED';
        //params.hs_call_disposition = mapOutcome['WRONG_NUMBER'];
        console.log("Your 'from' number is unverified!");
        break;
      case 13227:
      case 21215:
        params.hs_call_status = 'FAILED';
        //params.hs_call_disposition = mapOutcome['WRONG_NUMBER'];
        console.log("Missing geopermissions!");
        break;
      case 45305:
        params.hs_call_status = 'NO_ANSWER';
        params.hs_call_disposition = mapOutcome['NO_ANSWER'];
        console.log("No answer!");
        break;
      case 45303:
      case 31486:
        params.hs_call_status = 'BUSY';
        console.log("Busy!");
        break;
      default:
        params.hs_call_status = 'CANCELED';
        params.hs_call_disposition = mapOutcome['BUSY'];
        console.log("Generic error");
    }
  } else {
    params.hs_call_disposition = mapOutcome['CONNECTED'];
    params.hs_call_status = 'COMPLETED';
  }

  const token = manager.store.getState().flex.session.ssoTokenPayload.token;
  const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/logCall`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...params,
      Token: token
    })
  }).then(() => console.log('Log Sent'))
    .catch(() => console.log('Error while sending the log'))
    .finally(() => console.log('Done log'));
}

const LogHubspotMessage = async (task: ITask, manager: Flex.Manager) => {
  //console.log('JRUMEAU sending', task.attributes);
  if (!task.attributes.hubspot_contact_id) { 
    return;
  }
  
  const ownerId = manager.workerClient?.attributes?.hubspot_owner_id ?? null;

  const params = {
    conversationSid: task.attributes.conversationSid,
    hubspot_contact_id: task.attributes.hubspot_contact_id ?? null,
    hubspot_deal_id: task.attributes.hubspot_deal_id ?? null,
    hs_communication_channel_type: task.attributes.channelType == 'whatsapp' ? 'WHATS_APP' : 'SMS',
    hs_communication_logged_from: 'CRM',
    hs_communication_body: `NOTA: "${task.attributes.conversations?.content}"
    - Duración: ${task.age} segundos`,
    hs_timestamp: Date.parse(task.dateCreated.toUTCString()),
    hubspot_owner_id: ownerId,
  }

  const token = manager.store.getState().flex.session.ssoTokenPayload.token;
  const request = await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/logMessage`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...params,
      Token: token
    })
  }).then(() => console.log('Log Sent'))
    .catch(() => console.log('Error while sending the log'))
    .finally(() => console.log('Done log'));
}

const LogHubspotSummaryNote = async (task: ITask, manager: Flex.Manager) => {
  //console.log('JRUMEAU sending', task.attributes);
  if (!task.attributes.hubspot_contact_id) {
    return;
  }

  const ownerId = manager.workerClient?.attributes?.hubspot_owner_id ?? null;
  const accountCountry = manager.serviceConfiguration.attributes.account_country;

  const params = {
    conversationSid: task.attributes.conversationSid,
    hubspot_contact_id: task.attributes.hubspot_contact_id ?? null,
    hubspot_deal_id: task.attributes.hubspot_deal_id ?? null,
    hs_timestamp: Date.parse(task.dateCreated.toUTCString()),
    hubspot_owner_id: ownerId,
    accountCountry
  }

  const token = manager.store.getState().flex.session.ssoTokenPayload.token;
  await fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/logSummaryNote`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...params,
      Token: token
    })
  }).then(() => console.log('Log Sent'))
    .catch(() => console.log('Error while sending the log'))
    .finally(() => console.log('Done log'));
}

export default class FlexLogHubspotPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { typeof import('@twilio/flex-ui').Manager }
   */
  async init(flex: typeof Flex, manager: Flex.Manager) {

    manager.events.addListener("taskCanceled", (task: CancelableTask) => {
      console.log('TASKCANCELED', task);
      // Log de tareas canceladas si son llamadas	y supera el tiempo de marcado de llamadas
      if (task.taskChannelUniqueName.toLowerCase() === 'voice' && task.age > DELAY_TO_LOG_CALL_TASKS) {
        LogHubspotCall(task, manager);
      }
    });
      
    manager.events.addListener('taskCompleted', (task: CancelableTask) => {
      console.log('TASKCOMPLETED', task);
      if (task.taskChannelUniqueName === 'voice') { 
        LogHubspotCall(task, manager);
      } else if (task.taskChannelUniqueName == 'chat' || task.taskChannelUniqueName == 'sms') {
        LogHubspotMessage(task, manager);
        LogHubspotSummaryNote(task, manager);
      }
    });
  }


}
