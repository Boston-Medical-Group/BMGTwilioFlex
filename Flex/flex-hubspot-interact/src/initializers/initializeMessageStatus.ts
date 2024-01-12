import * as Flex from "@twilio/flex-ui";
// @ts-ignore

export const initializeMessageStatus = async (flex: typeof Flex, manager: Flex.Manager) => {

    flex.Actions.addListener('afterSendMessage', async (payload) => {
        console.log(payload);
    })
    

}