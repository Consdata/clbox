import {Draft} from '@reduxjs/toolkit';
import {inboxStatsFetched} from './inbox-stats-fetched';
import {InboxState} from "../inbox-state";

export const inboxStatsFetchedReducer = (state: Draft<InboxState>, action: ReturnType<typeof inboxStatsFetched>) => {
    state.stats = action.payload.stats;
};
