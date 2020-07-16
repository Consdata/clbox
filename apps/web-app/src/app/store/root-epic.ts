import {combineEpics} from 'redux-observable';
import {authenticationEpic} from '../features/authentication/state/authentication.epic';
import {inboxEpic} from '../features/inbox/state/inbox.epic';
import {teamEpic} from '../features/team/state/team.epic';

export const rootEpic = combineEpics(
    authenticationEpic,
    teamEpic,
    inboxEpic
);