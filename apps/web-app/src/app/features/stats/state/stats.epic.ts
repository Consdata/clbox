import {combineEpics} from 'redux-observable';
import {fetchStatsEpic} from './fetch-stats/fetch-stats.epic';

export const statsEpic = combineEpics(
  fetchStatsEpic
)
