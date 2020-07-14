import {Epic} from 'redux-observable';
import {delay, map} from 'rxjs/operators';
import {AppState} from '../../../state/app-state';
import {userAuthenticated} from '../../authentication/state/user-authenticated.action';
import {teamsFetched} from './teams-fetched';

export const fetchTeamsEpic: Epic<any, any, AppState> = (action$, state$) => action$
    .ofType(userAuthenticated.type)
    .pipe(
        delay(1000),
        map(_ => teamsFetched({
            teams: [{id: 'a', name: 'Team'}]
        }))
    );