import * as Flex from "@twilio/flex-ui"
import { Box, Paragraph, Button } from "@twilio-paste/core"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { AppState as FlexAppState } from '@twilio/flex-ui';
import { actions } from "../../states";

type MyProps = {
    manager: Flex.Manager
}

interface CustomTaskListState {
    summary: string;
}

// The type for your app's state will have flex at the top level,
// along with any additional state added by your plugin
interface AppState {
    flex: FlexAppState;
    summaryMessageState: {
        summaryMessage: CustomTaskListState;
    };
}

export const OpenaiSummaryContainer = ({ manager }: MyProps) => {

    const summary = useSelector(
        (state: AppState) => { 
            return state.summaryMessageState.summaryMessage.summary
        }
    );

    // Si no hay resumen, no es necesario mostrar el contenedor
    if (summary === '' || summary === undefined) {
        return (
            <></>
        )
    }

    const dispatch = useDispatch()

    // Cierra el resumen
    const closeSummary = () => {
        dispatch(actions.summaryMessage.setSummary(''));
    }
    
    return (
        <Box marginRight="space30">
            <Paragraph key="summary-text">{summary}</Paragraph>
            <Button variant="link" onClick={closeSummary}>Cerrar</Button>
        </Box>
    );
}

