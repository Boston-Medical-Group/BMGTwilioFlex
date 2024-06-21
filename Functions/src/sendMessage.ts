import '@twilio-labs/serverless-runtime-types';
import { Context } from '@twilio-labs/serverless-runtime-types/types';
import { Callback, functionValidator as FunctionTokenValidator, validator as TokenValidator } from 'twilio-flex-token-validator'

type MyEvent = {
    contentSid: string
    contentVariables: object
    conversationSid: string
    Token: string
}

type MyContext = {
    ACCOUNT_SID: string,
    AUTH_TOKEN: string
}

type TokenInformation = {
    worker_sid: string
    identity: string
}

//@ts-ignore
exports.handler = FunctionTokenValidator(async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: Callback
) {
    const {
        contentSid,
        contentVariables,
        conversationSid,
        Token
    } = event;

    // Create a custom Twilio Response
    // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
    //@ts-ignore
    const response = new Twilio.Response();
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    response.appendHeader("Content-Type", "application/json");

    try {
        //@ts-ignore
        const tokenInformation: TokenInformation = await TokenValidator(
            Token,
            context.ACCOUNT_SID || '',
            context.AUTH_TOKEN || ''
        );

        const {
            worker_sid,
            identity
        } = tokenInformation;
    
        const client = context.getTwilioClient();
        await client.conversations.v1.conversations(conversationSid).messages.create({
            contentSid,
            contentVariables: JSON.stringify(contentVariables),
            author: identity
        })
        
        response.setBody(response);
        // Return a success response using the callback function.
    } catch (err) {
        if (err instanceof Error) {
            // If there's an error, send an error response.
            // Keep using the response object for CORS purposes.
            response.setBody({ error: err.message });
        } else {
            response.setBody({});
        }
        response.setStatusCode(500);
    }

    callback(null, response);
});