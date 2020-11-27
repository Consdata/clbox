import {combineEpics} from 'redux-observable';
import {fetchProfileEpic} from './fetch-profile.epic';

export const profileEpic = combineEpics(
    fetchProfileEpic
)
