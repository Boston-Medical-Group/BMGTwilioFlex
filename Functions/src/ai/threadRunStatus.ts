import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import OpenAI from 'openai'

type MyContext = {
    OPENAI_API_KEY: string
    OPENAI_ASSITANT_ID: string
}

type MyEvent = {
    run_id: string
    thread_id: string
}
export const handler = async (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) => {
    
    //@ts-ignore
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setStatusCode(200)

    const openai = new OpenAI({ apiKey: context.OPENAI_API_KEY });

    const run : OpenAI.Beta.Threads.Runs.Run = await openai.beta.threads.runs.retrieve(event.thread_id, event.run_id)
    
    if (!run) {
        console.log('RUN NOT FOUND')
        response.setBody({
            code: "NOT_FOUND"
        })
        callback(null, response)
    }

    if (run.status !== 'completed') {
        console.log(`RUN NOT COMPLETED YET: ${run.status}`)
        response.setBody({
            code: "IN_PROGRESS"
        })
        callback(null, response)
    }

    const message = await openai.beta.threads.messages.list(event.thread_id)
        .then(async (messages) => {
            const runMessage = messages.getPaginatedItems().find((message) => message.run_id === event.run_id)
            return runMessage ? runMessage : null
        }).catch((error) => null)
    
    if (message) {
        if (message.content[0].type !== 'text') {
            response.setBody({
                code: "NOT_TEXT",
                body: null
            })
            callback(null, response)
        } else {
            response.setBody({
                code: "SUCCESS",
                body: message.content[0].text.value
            })
            callback(null, response)
        }
    } else {
        console.log('MESSAGE NOT FOUND')
        response.setBody({
            code: "NOT_FOUND"
        })
        callback(null, response)
    }

}