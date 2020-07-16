import {createReducer} from '@reduxjs/toolkit';
import {discardInboxFeedback} from './discard-inbox-feedback/discard-inbox-feedback.action';
import {discardInboxFeedbackReducer} from './discard-inbox-feedback/discard-inbox-feedback.reducer';
import {inboxFetchedReducer} from './fetch-inbox/inbox-featched.reducer';
import {inboxFetched} from './fetch-inbox/inbox-fetched';
import {InboxState} from './inbox-state';
import {inboxStateInitial} from './inbox-state-initial';
import {restoreInboxFeedback} from './restore-inbox-feedback/restore-inbox-feedback.action';
import {restoreInboxFeedbackReducer} from './restore-inbox-feedback/restore-inbox-feedback.reducer';

export const inboxReducer = createReducer<InboxState>(
    inboxStateInitial,
    builder => builder
        .addCase(inboxFetched, inboxFetchedReducer)
        .addCase(discardInboxFeedback, discardInboxFeedbackReducer)
        .addCase(restoreInboxFeedback, restoreInboxFeedbackReducer)
)