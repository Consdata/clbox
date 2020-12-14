import {createReducer} from '@reduxjs/toolkit';
import {InboxState} from './inbox-state';
import {inboxStateInitial} from './inbox-state-initial';
import {inboxFetched} from "./fetch-inbox/inbox-fetched";
import {discardInboxFeedbackReducer} from "./discard-inbox-feedback/discard-inbox-feedback.reducer";
import {discardInboxFeedback} from "./discard-inbox-feedback/discard-inbox-feedback.action";
import {restoreInboxFeedback} from "./restore-inbox-feedback/restore-inbox-feedback.action";
import {inboxFetchedReducer} from "./fetch-inbox/inbox-featched.reducer";
import {restoreInboxFeedbackReducer} from "./restore-inbox-feedback/restore-inbox-feedback.reducer";
import {inboxStatsFetched} from "./fetch-inbox-stats/inbox-stats-fetched";
import {inboxStatsFetchedReducer} from "./fetch-inbox-stats/fetch-inbox-stats.reducer";

export const inboxReducer = createReducer<InboxState>(
    inboxStateInitial,
    builder => builder
        .addCase(inboxStatsFetched, inboxStatsFetchedReducer)
        .addCase(inboxFetched, inboxFetchedReducer)
        .addCase(discardInboxFeedback, discardInboxFeedbackReducer)
        .addCase(restoreInboxFeedback, restoreInboxFeedbackReducer)
);
