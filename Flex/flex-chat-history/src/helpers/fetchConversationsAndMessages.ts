import * as Flex from '@twilio/flex-ui';

type MyBody = {
    Token: string
}

//fetch list of conversations using phoneNumber and dateOffset as filters
export async function fetchConversationsByParticipant(manager: Flex.Manager, phoneNumber: string) : Promise<any> {
    // Add the Token using the Flex manager
    const body : MyBody = {
        //WorkspaceSid: 'WS45ce05b26c5bdc08e60bb4dbd7c6a46f',
        Token: manager.store.getState().flex.session.ssoTokenPayload.token
    };

    const options = {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };

    return new Promise((resolve, reject) => {
        fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/conversation/history/fetchAllConversationsByParticipant?phoneNumber=${encodeURIComponent(phoneNumber)}`, options)
            .then(data => {
                resolve(data.json());
            })
    })
}

export async function fetchConversationMessages(manager: Flex.Manager, conversationSid: string) : Promise<any> {
    const body : MyBody = {
        //WorkspaceSid: 'WS45ce05b26c5bdc08e60bb4dbd7c6a46f',
        Token: manager.store.getState().flex.session.ssoTokenPayload.token
    };

    const options = {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    };

    return new Promise((resolve, reject) => {
        fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/conversation/history/fetchConversationMessages?conversationSid=${conversationSid}`, options)
            .then(data => {
                resolve(data.json());
            })
    })
}