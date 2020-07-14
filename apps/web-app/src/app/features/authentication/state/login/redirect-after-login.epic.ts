import {replace} from 'connected-react-router';
import {Epic} from 'redux-observable';
import {map} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {loggedIn} from './logged-in.action';

export const redirectAfterLogin: Epic<any, any, AppState> = (action$) => action$
    .ofType(loggedIn.type)
    .pipe(
        map(_ => replace('/dashboard'))
    );