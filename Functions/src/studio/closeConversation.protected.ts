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

  try {
    const conversationContext = client.conversations.v1.conversations(conversationSid)
    const conversation = await conversationContext.fetch()
      .then(async (conversation) => {
        if (conversation.state !== "closed") {
          await conversation.update({ state: "closed" })
        }
      })
    
  } catch (error) {
    console.log(error);
  }

  callback(null, {});
};

