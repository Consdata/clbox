import {combineEpics} from 'redux-observable';
import {authenticationEpic} from '../features/authentication/state/authentication.epic';
import {fetchTeamsEpic} from '../features/team/state/fetch-teams.epic';

export const rootEpic = combineEpics(
    authenticationEpic,
    fetchTeamsEpic
);