// This code should be used in a Twilio Function https://console.twilio.com/us1/develop/functions/services to create a service
// Copy and Paste the below to a new twilio function under a serivce that you created 
//in deps add Module openai-	Version	3.2.1	
//also twilio-flex-token-validator version latest
// under enviromental variables add API_KEY and use your openaikey get it from here https://platform.openai.com/account/api-keys
//under enviromental variables add you could also add the model under API_MODEL , if not it will default to gpt3.5 turbo.
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(async (context, event, callback) => {
    //Set CORS headers (for HTTP call Flex --> Function)
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');


    // Importing required modules
    const OpenAI = require("openai");

    // Getting spoken input and request type from the event
    //const spokenInput = event.spokeninput; 
    const spokenInput = event.input;

    const requestType = event.requestType;

    // Getting event context, if any
    const eventcontext = event.context;

    console.log("this is what i got from flex:", spokenInput);

    // Getting the API key from Twilio environment variables
    const API_KEY = context.OPENAI_GPT_API_KEY;
    const API_MODEL = context.API_MODEL;
    console.log("api model:", API_MODEL);
    console.log("request type:", requestType);

    const openai = new OpenAI({
        apiKey: API_KEY,
    });

    // Setting the prompt based on the request type and context, if any
    let prompt = spokenInput;
    if (requestType === "summary") {
        const history = await context.getTwilioClient().conversations.v1.conversations(event.input).messages.list();
        /** @type array */
        let historyDelivered = history.filter((h) => h.delivery === null || h.delivery?.delivered === 'all')
        let messages = [];
        historyDelivered.forEach((h) => {
            let author = 'Agente'
            if (h.author.startsWith('whatsapp:')) {
                author = 'Cliente'
            }
            messages.push(`${h.dateCreated} @ ${author} : ${h.body}`)
        })
        prompt = `escribe un corto resumen , max 5 lineas del siguiente historial de conversación, da relevancia a los mensajes más recientes, no incluyas las fechas en las respuestas y da una sugerencia de como continuar la conversación: ${messages.concat('\n\n')}`;
    }
    if (requestType === "suggest" && eventcontext) {
        prompt = `play a role game imagine that you are a customer service agent , I will ask you a question  if you think you can respond and it is a good response, then please respond with a short suggested response, DO NOT use a prefix with colon i.e suggested response,  here is my question : ${spokenInput} if relevant take into account the following information but only use it if is related to the question :  ${eventcontext}  `;
    }
    if (requestType === "suggest" && !eventcontext) {
        prompt = `play a role game imagine that you are a customer service agent , I will ask you a question  if you think you can respond and it is  a good enough response  , then please respond with three lines max , DO NOT use a prefix with colon i.e suggested response, here is my question : ${spokenInput}   `;
    }



    if (requestType === "sentiment") {
        /* original sentiment analysis prompt no suggesion
            prompt = `evaluate the sentiment of the customer on this interaction and tell me how the customer feels in two lines max using text and also an emoji  : ${spokenInput}`;
         */

        //prompt that provides suggestion to the agent as well as sentiment analysis
        prompt = `evaluate the sentiment of the customer on this interaction and tell me how the customer feels in two lines max using text and also an emoji : ${spokenInput} ,after the emoji provide a suggestion to the agent in terms of how to handle the conversation based on the sentimet evaluation, add it in a new sentence leaving a line`;

    }

    // Sending a request to the OpenAI API to create a completion based on the prompt

    //Model has to be set under ennvirmental variable using API_MODEL and model name from openapi
    //if it is not set it will default to gpt-3.5-turbo

    if (!API_MODEL) {

        openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        })
            .then(completion => {
                // Extracting the summary from the OpenAI API response
                const summary = completion.choices[0].message.content;
                response.appendHeader('Content-Type', 'application/json');
                response.setBody({ summary })
                callback(null, response);
            })
            .catch(error => {
                response.appendHeader('Content-Type', 'plain/text');
                response.setBody(error.message);
                response.setStatusCode(500);
                callback(null, response);
            });
    }

    else if (API_MODEL.startsWith('gpt-')) {


        openai.createChatCompletion(({
            model: API_MODEL,
            messages: [{ role: "user", content: prompt }],

        }))
            .then(completion => {
                // Extracting the summary from the OpenAI API response
                const summary = completion.choices[0].message.content;
                response.appendHeader('Content-Type', 'application/json');
                response.setBody({ summary })
                callback(null, response);
            })
            .catch(error => {
                response.appendHeader('Content-Type', 'plain/text');
                response.setBody(error.message);
                response.setStatusCode(500);
                callback(null, response);
            });
    }
    else if (API_MODEL.startsWith('text-')) {
        //default model is text-davinci-003 
        openai.createCompletion({
            model: "model: API_MODEL",
            prompt,
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
            .then(data => {
                // Extracting the summary from the OpenAI API response
                const summary = data.choices[0].text;
                response.appendHeader('Content-Type', 'application/json');
                response.setBody({ summary })
                callback(null, response);
            })
            .catch(error => {
                response.appendHeader('Content-Type', 'plain/text');
                response.setBody(error.message);
                response.setStatusCode(500);
                callback(null, response);
            });

    }
    else {
        const response = new Twilio.Response();
        response.appendHeader('Content-Type', 'plain/text');
        response.setBody('Invalid model parameter only gpt and text models supported');
        response.setStatusCode(400);
        return callback(null, response);
    }

});

