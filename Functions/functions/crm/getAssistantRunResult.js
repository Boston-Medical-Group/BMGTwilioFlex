const OpenAI = require("openai");

//under enviromental variables add you could also add the model under API_MODEL , if not it will default to gpt3.5 turbo.
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(async (context, event, callback) => {
    //Set CORS headers (for HTTP call Flex --> Function)
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    const API_KEY = context.OPENAI_GPT_ASSISTANT_APIKEY;

    const openai = new OpenAI({
        apiKey: API_KEY,
    });

    const run = await openai.beta.threads.runs.retrieve(event.thread_id, event.run_id)

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

})