import { createSlice } from '@reduxjs/toolkit';
import { CallCardType } from '../Types';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface InteractionCallCardState {
    callCard?: CallCardType
    isLoading?: boolean
}

// Define the initial state for your reducer
const initialState : InteractionCallCardState = {
    callCard: undefined,
    isLoading: false
};

// Create your reducer and actions in one function call
// with the createSlice utility
export const interactionCallCardSlice = createSlice({
    name: 'interactionCallCard',
    initialState,
    reducers: {
        setCallCard: (state, action: PayloadAction<CallCardType>) => {
            // Instead of recreating state, you can directly mutate
            // state values in these reducers. Immer will handle the
            // immutability aspects under the hood for you
            state.callCard = action.payload;
        },

        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    },
});

// You can now export your reducer and actions
// with none of the old boilerplate
export const { setCallCard, setIsLoading } = interactionCallCardSlice.actions;
export default interactionCallCardSlice.reducer;
