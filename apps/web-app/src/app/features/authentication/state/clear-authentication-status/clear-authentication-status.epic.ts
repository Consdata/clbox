import {LOCATION_CHANGE} from 'connected-react-router';
import {Epic} from 'redux-observable';
import {filter, map, withLatestFrom} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {loginRequested} from '../login/login-requested.action';
import {clearAuthenticationStatus} from './clear-authentication-status.action';

export const clearAuthenticationStatusEpic: Epic<any, any, AppState> = (action$, state$) => action$
    .ofType(loginRequested, LOCATION_CHANGE)
    .pipe(
        withLatestFrom(state$),
        filter(([_, state]) => !!state.authentication.statusMessage),
        map(_ => clearAuthenticationStatus())
    );