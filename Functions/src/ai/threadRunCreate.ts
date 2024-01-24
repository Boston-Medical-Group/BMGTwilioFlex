import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import OpenAI from "openai";

type MyContext = {
    OPENAI_API_KEY: string
    OPENAI_ASSITANT_ID: string
}

type MyEvent = {
    conversation_sid: string
}

type ConversationAttributes = {
    thread_id: string
    [key: string]: any
}

export const handler = async (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) => {
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setStatusCode(200)

    if (!event.conversation_sid) {
        response.setStatusCode(404)
        response.setBody({})
        callback(null, response)
    }

    const client = context.getTwilioClient()
    const threadId : string | null = await client.conversations.v1.conversations(event.conversation_sid).fetch()
        .then(async (conversation) => {
            const conversationAttributes: ConversationAttributes = JSON.parse(conversation.attributes)
            if (!conversationAttributes.thread_id) {
                return null
            }

            return conversationAttributes.thread_id
        }).catch((error) => {
            console.log(error)
            return null
        })
    
    if (!threadId || threadId === null) {
        response.setStatusCode(404)
        response.setBody({})
        callback(null, response)
    }

    const openai = new OpenAI({ apiKey: context.OPENAI_API_KEY });
    const run = await openai.beta.threads.runs.create(
        threadId as string,
        {
            assistant_id: context.OPENAI_ASSITANT_ID
        }
    )
        .then((run) => (run))
        .catch((error) => {
            console.log(error)
            return null
        });

    if (!run || run === null) {
        console.log('NO RUN FOUND')
        response.setStatusCode(400)
        response.setBody({})
        callback(null, response)
    } else {
        response.setBody(run)
        callback(null, response)
    }
}