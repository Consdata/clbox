import {Epic} from 'redux-observable';
import {delay, map} from 'rxjs/operators';
import {AppState} from '../../../state/app-state';
import {loggedIn} from '../../authentication/state/login/logged-in.action';
import {teamsFetched} from './teams-fetched';

export const fetchTeamsEpic: Epic<any, any, AppState> = (action$, state$) => action$
    .ofType(loggedIn.type)
    .pipe(
        delay(1000),
        map(_ => teamsFetched({
            teams: [{id: 'a', name: 'Team'}]
        }))
    );