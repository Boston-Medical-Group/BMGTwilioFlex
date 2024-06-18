import { createSlice } from '@reduxjs/toolkit';
import { HubspotContact } from '../Types';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface HubspotCRMState {
    contact?: HubspotContact
}

// Define the initial state for your reducer
const initialState: HubspotCRMState = {
    contact: undefined,
};

// Create your reducer and actions in one function call
// with the createSlice utility
export const hubspotCRMSlice = createSlice({
    name: 'hubspotCRM',
    initialState,
    reducers: {
        setContact: (state, action: PayloadAction<undefined | HubspotContact>) => {
            // Instead of recreating state, you can directly mutate
            // state values in these reducers. Immer will handle the
            // immutability aspects under the hood for you
            state.contact = action.payload;
        }
    },
});

// You can now export your reducer and actions
// with none of the old boilerplate
export const { setContact } = hubspotCRMSlice.actions;
export default hubspotCRMSlice.reducer;
