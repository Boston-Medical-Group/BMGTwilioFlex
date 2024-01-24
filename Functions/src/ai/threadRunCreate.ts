import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import OpenAI from "openai";
import { MessageInstance } from "twilio/lib/rest/conversations/v1/conversation/message";

type MyContext = {
    OPENAI_API_KEY: string
    OPENAI_ASSITANT_ID: string
}

type MyEvent = {
    conversation_sid: string
    thread_id?: string
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
    const threadMessages: OpenAI.Beta.Threads.MessageCreateParams[] = []
    //Obtiene los mensajes de la conversacion
    await client.conversations.v1.conversations(event.conversation_sid).messages.list({
        limit: 20,
        order: 'desc'
    }).then(async (messages) => {
        messages.map((message) => {
            threadMessages.push({
                role: "user",
                content: message.body
            })
        })
    })

    type ReturnResult = null | { thread_id: string, run_id?: string }
    const openai = new OpenAI({ apiKey: context.OPENAI_API_KEY });
    const result : ReturnResult = await openai.beta.threads.create({
        messages: threadMessages
    }).then(async thread => {
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: context.OPENAI_ASSITANT_ID
        })
            .then((run) => (run))
            .catch((error) => {
                console.log(error)
                return null
            });

        return {
            thread_id: thread.id,
            run_id: run?.id
        }
    }).catch((error) => {
        return null
    })

    if (!result) {
        console.log('NO RUN FOUND')
        response.setStatusCode(400)
        response.setBody({})
        callback(null, response)
    } else {
        response.setBody(result)
        callback(null, response)
    }
}