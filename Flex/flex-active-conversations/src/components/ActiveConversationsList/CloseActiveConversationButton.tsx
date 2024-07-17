import { Button } from '@twilio-paste/core'
import * as Flex from '@twilio/flex-ui'
import { useState } from 'react'
import { closeConversation } from './ConversationDetails'
import useLang from '../../hooks/useLang'

type Props = {
    manager: Flex.Manager
    conversationSid: string
    closedCallback?: () => void
}

const CloseActiveConversationButton = ({conversationSid, manager, closedCallback} : Props) => {
    const { _l } = useLang()
    const [isLoading, setIsLoading] = useState(false)

    const close = (manager: Flex.Manager, conversationSid: string) => {
        
        setIsLoading(true)
        closeConversation(manager, conversationSid).then(() => {
            setIsLoading(false)
            if (closedCallback !== undefined) {
                closedCallback()
            }
        })
    }
    return (
        <Button variant="destructive" onClick={() => {
            close(manager, conversationSid)
        }} loading={isLoading}>{_l('Close conversation')}</Button>
    )
}

export default CloseActiveConversationButton