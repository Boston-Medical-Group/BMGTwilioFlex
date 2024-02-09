import * as Flex from '@twilio/flex-ui';

type MyBody = {
    Token: string
}

type ConversationEntries = {
    conversationOriginalChannel: string,
    conversationSid: string
    conversationDateCreated: string
    conversationState: string
    from: string
}

type MessageEntries = {
    index: string
    author: string
    body: string
    media: string
    dateCreated: string
}

//fetch list of conversations using phoneNumber and dateOffset as filters
export async function fetchConversationsByParticipant(manager: Flex.Manager, phoneNumber: string) : Promise<Array<ConversationEntries>> {
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
        fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/conversation/history/fetchConversationsByParticipant?phoneNumber=${encodeURIComponent(phoneNumber)}`, options)
            .then(data => {
                resolve(data.json());
            })
            .catch(error => {
                reject(error)
            })
    })
}

export async function fetchConversationMessages(manager: Flex.Manager, conversationSid: string) : Promise<Array<MessageEntries>> {
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