import { combineReducers } from '@reduxjs/toolkit';
import { AppState as FlexAppState } from '@twilio/flex-ui';

import interactionCallCardReducer, {
    InteractionCallCardState,
    setCallCard,
    setIsLoading
} from './interactionCallCardState';

import interactionReducer, {
    InteractionState,
    setContact,
    setDeal
} from './interactionState';

// You need to register your redux store(s) under a unique namespace
export const namespace = 'hubspotInteraction';

// It can be helpful to create a map of all actions for typed access
export const actions = {
    interactionCallCard: {
        setCallCard,
        setIsLoading
    },
    interaction: {
        setContact,
        setDeal
    }
};

// The type for your app's state will have flex at the top level,
// along with any additional state added by your plugin
export interface AppState {
    flex: FlexAppState;
    interactionCallCardState: {
        interactionCallCard: InteractionCallCardState;
    };
    interactionState: {
        interaction: InteractionState
    },
    strings: {
        [key: string]: string
    }
}

// Combine any number of reducers to support the needs of your plugin
export const reducers = combineReducers({
    interactionCallCard: interactionCallCardReducer,
    interaction: interactionReducer
});