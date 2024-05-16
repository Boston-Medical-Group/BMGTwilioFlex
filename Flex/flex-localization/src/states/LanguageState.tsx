import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    language: 'es'
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        }
    },
});

// You can now export your reducer and actions
// with none of the old boilerplate
export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;