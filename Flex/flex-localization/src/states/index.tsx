import { combineReducers } from '@reduxjs/toolkit';

import languageReducer, { setLanguage } from './LanguageState';

// You need to register your redux store(s) under a unique namespace
export const namespace = 'languageState';

// It can be helpful to create a map of all actions for typed access
export const actions = {
    language: {
        setLanguage
    },
};

// Combine any number of reducers to support the needs of your plugin
export const reducers = combineReducers({
    language: languageReducer,
});