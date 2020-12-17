import {combineEpics} from 'redux-observable';
import {fetchInboxStatsEpic} from "./fetch-inbox-stats/fetch-inbox-stats.epic";
import {fetchInboxEpic} from "./fetch-inbox/fetch-inbox.epic";
import {discardInboxFeedbackEpic} from "./discard-inbox-feedback/discard-inbox-feedback.epic";
import {editFeedbackCommentEpic} from "./edit-feedback-comment/edit-feedback-comment.epic";
import {editFeedbackLabelsEpic} from "./edit-feedback-labels/edit-feedback-labels.epic";

export const inboxEpic = combineEpics(
    fetchInboxStatsEpic,
    fetchInboxEpic,
    discardInboxFeedbackEpic,
    editFeedbackCommentEpic,
    editFeedbackLabelsEpic
)
