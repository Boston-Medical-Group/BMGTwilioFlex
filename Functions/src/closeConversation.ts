import { Context, ServerlessCallback } from '@twilio-labs/serverless-runtime-types/types';
import { Callback, functionValidator as FunctionTokenValidator, validator as TokenValidator } from 'twilio-flex-token-validator'

type MyEvent = {
  conversationSid: string;
}

type MyContext = {}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) {

  //@ts-ignore
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  const conversationSid = event.conversationSid

  const client = context.getTwilioClient()

  let sendResponse: any = {};
  try {
    const conversationContext = client.conversations.v1.conversations(conversationSid)
    const conversation = await conversationContext.fetch()
      .then(async (conversation) => {
        if (conversation.state !== "closed") {
          await conversation.update({ state: "closed" }).then(() => {
            sendResponse.result = 'OK'
          })
        }
      })
    
    response.setBody(sendResponse);
    
  } catch (error) {
    console.log(error);
    response.setBody({ error })
  }

  callback(null, response);
});

