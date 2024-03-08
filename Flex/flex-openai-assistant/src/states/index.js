import { combineReducers } from '@reduxjs/toolkit';
import SummaryStateReducer, { setSummary } from './SummaryState';

// You need to register your redux store(s) under a unique namespace
export const namespace = 'summaryMessageState';

// It can be helpful to create a map of all actions
export const actions = {
    summaryMessage: {
        setSummary,
    },
};

// Combine any number of reducers to support the needs of your plugin
export const reducers = combineReducers({
    summaryMessage: SummaryStateReducer,
});