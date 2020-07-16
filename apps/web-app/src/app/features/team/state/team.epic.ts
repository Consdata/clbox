import {combineEpics} from 'redux-observable';
import {fetchTeamsEpic} from './fetch-teams.epic';

export const teamEpic = combineEpics(
    fetchTeamsEpic
)