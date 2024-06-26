import * as Flex from "@twilio/flex-ui"
import { Box, Stack, Heading, DetailText, ButtonGroup, Button } from "@twilio-paste/core"
import { RefreshIcon } from "@twilio-paste/icons/esm/RefreshIcon"
import { NewIcon } from "@twilio-paste/icons/esm/NewIcon"
import { useState, useEffect } from "react"
import useLang from "../../../../hooks/useLang"

type Props = {
    withoutButtons: boolean
    conversationSid?: string
    summary: any
    reloadAction: Function
    suggestAction: Function
    loading?: boolean
}

const SummaryContent = ({ withoutButtons, conversationSid, summary, reloadAction, suggestAction, loading } : Props) => {
    const { _l } = useLang()
    const [withButtons, setWithButtons] = useState<boolean>(false)

    useEffect(() => {
        // withoutButtons === true -> Sin botones
        // withoutBUttons === false -> Con botones
        setWithButtons(withoutButtons === false)
    }, [])

    return (
        <Box padding="space40" width="100%">
            <Stack spacing="space60" orientation="vertical">
                <Heading as="h4" variant="heading40">{_l('Activity summary (AI)')}</Heading>
                <DetailText>{summary.content}</DetailText>
                
                <Box>
                    <ButtonGroup>
                        <Button variant="primary" size="small" onClick={async () => reloadAction(conversationSid, true)} disabled={loading}>
                            <RefreshIcon decorative={false} title={_l('Refresh summary (AI)')} />
                            {_l('Refresh summary (AI)')}
                        </Button>
                        
                        <Button variant="primary" size="small" onClick={async () => suggestAction()} disabled={loading || !withButtons}>
                            <NewIcon decorative={false} title={_l('Suggest reply (AI)')} />
                            {_l('Suggest reply (AI)')}</Button>
                    </ButtonGroup> 
                </Box>
            </Stack>
        </Box>
    )
}

export default SummaryContent