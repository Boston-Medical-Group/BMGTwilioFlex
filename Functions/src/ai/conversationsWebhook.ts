import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import OpenAI from "openai";

type MyContext = {
    OPENAI_API_KEY: string
    OPENAI_ASSITANT_ID: string
}

type MyEvent = {
    EventType: string
    Body: string
    Author: string
    Source: "WHATSAPP" | "SMS"
    ConversationSid: string
    Attributes: {
        [key: string]: any
    }
}

type ConversationAttributes = {
    thread_id: string
    [key: string]: any
}

export const handler = async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
    
) {
    // Crear cliente OPEN AI
    const openai = new OpenAI({ apiKey: context.OPENAI_API_KEY });
    const client = context.getTwilioClient();
    if (event.EventType === "onConversationAdded") {
        // Crear thread
        await openai.beta.threads.create()
            .then(async (thread) => {
                await client.conversations.v1.conversations(event.ConversationSid).fetch()
                    .then(async (conversation) => {
                        const attributes : ConversationAttributes = JSON.parse(conversation.attributes)
                        attributes.thread_id = thread.id
                        await client.conversations.v1.conversations(event.ConversationSid).update({
                            attributes: JSON.stringify(attributes)
                        }).catch((error) => {
                            console.log(error)
                        })
                    }).catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })

        callback(null, {})
    } else if (event.EventType === "onMessageAdded") {
        // Crear mensaje
        await client.conversations.v1.conversations(event.ConversationSid).fetch()
            .then(async (conversation) => {
                const attributes : ConversationAttributes = JSON.parse(conversation.attributes)
                if (attributes.thread_id) {
                    await openai.beta.threads.messages.create(attributes.thread_id, {
                        role: "user",
                        content: event.Body
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            })
    }

    console.log(event.ConversationSid)

    callback(null, {})
}