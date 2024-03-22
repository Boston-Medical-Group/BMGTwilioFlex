// This code should be used in a Twilio Function https://console.twilio.com/us1/develop/functions/services to create a service
// Copy and Paste the below to a new twilio function under a serivce that you created 
//in deps add Module openai-	Version	3.2.1	
//also twilio-flex-token-validator version latest
// under enviromental variables add API_KEY and use your openaikey get it from here https://platform.openai.com/account/api-keys

import { Context, ServerlessCallback } from "@twilio-labs/serverless-runtime-types/types";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

//under enviromental variables add you could also add the model under API_MODEL , if not it will default to gpt3.5 turbo.
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

type MyContext = {
    OPENAI_GPT_API_KEY: string;
    API_MODEL: string;
}

type MyEvent = {
    input: string
    requestType: string
    context?: string
}

exports.handler = TokenValidator(async (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
) => {
    //Set CORS headers (for HTTP call Flex --> Function)
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Getting spoken input and request type from the event
    //const spokenInput = event.spokeninput; 
    const spokenInput = event.input;

    const requestType = event.requestType;

    // Getting the API key from Twilio environment variables
    const API_KEY = context.OPENAI_GPT_API_KEY;
    const API_MODEL = context.API_MODEL;

    const openai = new OpenAI({
        apiKey: API_KEY,
    });

    // Setting the prompt based on the request type and context, if any
    let prompt = spokenInput;
    
    const history = await context.getTwilioClient().conversations.v1.conversations(event.input).messages.list();

    /** @type array */
    let historyDelivered = history.filter((h) => h.delivery === null || h.delivery?.delivered === 'all')
    let messages: Array<ChatCompletionMessageParam> = [];

    // System messages
    messages.push({
        role: 'system',
        content: 'Eres el asistente de resúmenes de conversaciones de Boston Medical, la clínica de salud sexual masculina.'
    })
    messages.push({
        role: 'system',
        content: 'La conversación se produce entre nuestro agente y un paciente por Whatsapp.'
    })

    historyDelivered.forEach((h) => {
        let author : 'assistant' | 'user' = 'assistant'
        if (h.author.startsWith('whatsapp:')) {
            author = 'user'
        }
        messages.push({
            role: author,
            content: h.body
        })
    })

    if (requestType === "summary") {
        messages.push({
            role: 'assistant',
            content: 'Crea un resumen de la conversación en máximo 500 caracteres. No incluyas las fechas. De tener el dato, menciona la ciudad desde la que nos contacta y la clínica a la cuál quiere asistir'
        })
    }
    if (requestType === "suggest") {
        messages.push({
            role: 'assistant',
            content: 'Ofrece una sugerencia acerca de como continuar la conversación, responde sólo con el mensaje sugerido'
        })
    }
    if (requestType === "sentiment") {
        messages.push({
            role: 'assistant',
            content: 'Evalúa el sentimiento del paciente con respecto a su intención de agendar una cita en una escala del 1 al 100 y responde sólo con el número'
        })
    }

    if (!API_MODEL) {
        openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages,
        })
            .then(completion => {
                // Extracting the summary from the OpenAI API response
                const reply = completion.choices[0].message.content;
                response.appendHeader('Content-Type', 'application/json');
                response.setBody({ reply })
                callback(null, response);
            })
            .catch(error => {
                response.appendHeader('Content-Type', 'plain/text');
                response.setBody(error.message);
                response.setStatusCode(500);
                callback(null, response);
            });
    } else {
        const response = new Twilio.Response();
        response.appendHeader('Content-Type', 'plain/text');
        response.setBody('Invalid model parameter only gpt and text models supported');
        response.setStatusCode(400);
        return callback(null, response);
    }

});

