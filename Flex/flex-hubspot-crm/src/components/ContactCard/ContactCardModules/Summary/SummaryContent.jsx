import { Box, Stack, Heading, DetailText, ButtonGroup, Button } from "@twilio-paste/core"
import { RefreshIcon } from "@twilio-paste/icons/esm/RefreshIcon"
import { NewIcon } from "@twilio-paste/icons/esm/NewIcon"
import { useState, useEffect } from "react"

const SummaryContent = ({ withoutButtons, conversationSid, summary, reloadAction, suggestAction, loading, manager }) => {
    
    const [withButtons, setWithButtons] = useState(false)

    useEffect(() => {
        // withoutButtons === true -> Sin botones
        // withoutBUttons === false -> Con botones
        setWithButtons(withoutButtons === false)
    }, [])

    return (
        <Box padding="space40" width="100%">
            <Stack spacing="space60" orientation="vertical">
                <Heading as="h4" variant="heading40">Resumen de actividad (IA)</Heading>
                <DetailText>{summary.content}</DetailText>
                
                <Box>
                    <ButtonGroup>
                        <Button variant="primary" size="small" onClick={async () => reloadAction(conversationSid, true)} disabled={loading}>
                            <RefreshIcon decorative={false} title="Refrescar resumen (IA)" />
                            Refrescar resumen (IA)
                        </Button>
                        {withButtons && (
                            <Button variant="primary" size="small" onClick={async () => suggestAction()} disabled={loading}>
                                <NewIcon decorative={false} title="Sugerir respuesta (IA)" />
                                Sugerir respuesta (IA)</Button>
                        )}
                    </ButtonGroup> 
                </Box>
            </Stack>
        </Box>
    )
}

export default SummaryContent