import {Draft} from '@reduxjs/toolkit';
import {restoreInboxFeedback} from './restore-inbox-feedback.action';
import {MessageState} from "../../../message/model/message-state";
import {InboxState} from "../inbox-state";

export const restoreInboxFeedbackReducer = (state: Draft<InboxState>, action: ReturnType<typeof restoreInboxFeedback>) => {
    state.messages.byId[action.payload.message.id].state = MessageState.Pending
};
