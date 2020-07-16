import {combineEpics} from 'redux-observable';
import {discardInboxFeedbackEpic} from './discard-inbox-feedback/discard-inbox-feedback.epic';
import {fetchInboxEpic} from './fetch-inbox/fetch-inbox.epic';

export const inboxEpic = combineEpics(
    fetchInboxEpic,
    discardInboxFeedbackEpic
)