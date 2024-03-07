import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for your reducer
const initialState = {
    summary: '',
};

// Create your reducer and actions in one function call
// with the createSlice utility
export const summaryMessage = createSlice({
    name: 'summaryMessage',
    initialState,
    reducers: {
        setSummary: (state, action) => {
            console.log('SETSUMMARY', action)
            state.summary = action.payload;
        },
    },
});

// You can now export your reducer and actions
// with none of the old boilerplate
export const { setSummary } = summaryMessage.actions;
export default summaryMessage.reducer;
