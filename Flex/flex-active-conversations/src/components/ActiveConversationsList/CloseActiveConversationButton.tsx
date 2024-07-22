import { AlertDialog, Box, Button, Modal, ModalHeading } from '@twilio-paste/core'
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
    const [confirming, setConfirming] = useState(false)

    const close = () => {
        setConfirming(true)
    }

    const closeConfirm = (manager: Flex.Manager, conversationSid: string) => {
        setConfirming(false)
        setIsLoading(true)
        closeConversation(manager, conversationSid).then(() => {
            setIsLoading(false)
            if (closedCallback !== undefined) {
                closedCallback()
            }
        })
    }
    return (
        <Box paddingLeft={'space60'}>
            <Button variant="destructive" onClick={close} loading={isLoading}>{_l('Close conversation')}</Button>

            <AlertDialog
                destructive
                heading={_l('Close conversation')}
                isOpen={confirming}
                onConfirm={() => closeConfirm(manager, conversationSid)}
                onConfirmLabel={_l('Confirm')}
                onDismiss={() => setConfirming(false)}
                onDismissLabel={_l('Cancel')}>
                {_l('Are you sure you want to close this conversation?')}
                </AlertDialog>
        </Box>
    )
}

export default CloseActiveConversationButton