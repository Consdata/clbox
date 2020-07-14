import {Epic} from 'redux-observable';
import {delay, map} from 'rxjs/operators';
import {AppState} from '../../../state/app-state';
import {requestAuthentication} from './request-authentication.action';
import {userAuthenticated} from './user-authenticated.action';

export const authenticateEpic: Epic<any, any, AppState> = (action$, state$) => action$
    .ofType(requestAuthentication.type)
    .pipe(
        delay(1000),
        map(_ => userAuthenticated())
    );