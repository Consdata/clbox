import {Draft} from '@reduxjs/toolkit';
import {InboxState} from '../inbox-state';
import {InboxMessageState} from '../model/inbox-message-state';
import {discardInboxFeedback} from './discard-inbox-feedback.action';

export const discardInboxFeedbackReducer = (state: Draft<InboxState>, action: ReturnType<typeof discardInboxFeedback>) => {
    state.messages.byId[action.payload.message.id].state = InboxMessageState.Discarded
};