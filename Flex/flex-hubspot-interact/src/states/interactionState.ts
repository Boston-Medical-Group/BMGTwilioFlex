import { createSlice } from '@reduxjs/toolkit';
import { HubspotContactRaw, HubspotContact, HubspotDeal, HubpostContactType } from '../Types';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface InteractionState {
    contact?: HubspotContact
    deal?: HubspotDeal
}

// Define the initial state for your reducer
const initialState: InteractionState = {
    contact: undefined,
    deal: undefined
};

// Create your reducer and actions in one function call
// with the createSlice utility
export const interactionSlice = createSlice({
    name: 'interaction',
    initialState,
    reducers: {
        setContact: (state, action: PayloadAction<undefined | HubspotContact>) => {
            // Instead of recreating state, you can directly mutate
            // state values in these reducers. Immer will handle the
            // immutability aspects under the hood for you
            state.contact = action.payload;
        },

        setDeal: (state, action: PayloadAction<undefined | HubspotDeal>) => {
            state.deal = action.payload
        }
    },
});

// You can now export your reducer and actions
// with none of the old boilerplate
export const { setContact, setDeal } = interactionSlice.actions;
export default interactionSlice.reducer;
