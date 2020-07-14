import {combineEpics} from 'redux-observable';
import {authenticateEpic} from '../features/authentication/state/authenticate.epic';
import {fetchTeamsEpic} from '../features/team/state/fetch-teams.epic';

export const rootEpic = combineEpics(
    authenticateEpic,
    fetchTeamsEpic
);