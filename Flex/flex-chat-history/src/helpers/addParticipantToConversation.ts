import * as Flex from '@twilio/flex-ui';

export const addParticipantToConversation = async (manager: Flex.Manager, conversationSid: string, address: string) => {
    const body = {
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
        fetch(`${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/conversation/history/addParticipantToConversation?conversationSid=${conversationSid}&address=${encodeURIComponent(address)}`, options)
            .then(data => {
                resolve(data.json());
            })
    })
}