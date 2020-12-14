import {combineEpics} from 'redux-observable';
import {fallbackDiscardInboxFeedbackEpic} from './fallback/discard-inbox-feedback/fallback-discard-inbox-feedback.epic';
import {fallbackFetchInboxEpic} from './fallback/fetch-inbox/fallback-fetch-inbox.epic';
import {features} from "../../features/features";
import {fetchInboxStatsEpic} from "./fetch-inbox-stats/fetch-inbox-stats.epic";
import {fetchInboxEpic} from "./fetch-inbox/fetch-inbox.epic";

export const inboxEpic = features.inboxRefreshed ?
  combineEpics(fetchInboxStatsEpic, fetchInboxEpic) :
  combineEpics(fallbackFetchInboxEpic, fallbackDiscardInboxFeedbackEpic)
