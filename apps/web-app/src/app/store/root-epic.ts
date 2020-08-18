import {combineEpics} from 'redux-observable';
import {authenticationEpic} from '../features/authentication/state/authentication.epic';
import {inboxEpic} from '../features/inbox/state/inbox.epic';
import {statsEpic} from '../features/stats/state/stats.epic';
import {teamEpic} from '../features/team/state/team.epic';

export const rootEpic = combineEpics(
  authenticationEpic,
  teamEpic,
  inboxEpic,
  statsEpic
);
