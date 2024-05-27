import { Client as HubspotClient } from '@hubspot/api-client';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';

type MyEvent = {
  conversationSid: string;
}

type MyContext = {}

exports.handler = async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {

  const conversationSid = event.conversationSid

  const client = context.getTwilioClient()

  await client.conversations.v1.conversations(conversationSid).update({ state: "closed" })

  callback(null, {});
};

