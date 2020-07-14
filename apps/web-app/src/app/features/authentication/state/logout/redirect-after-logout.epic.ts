import {replace} from 'connected-react-router';
import {Epic} from 'redux-observable';
import {map} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {loggedOut} from './logged-out.action';

export const redirectAfterLogout: Epic<any, any, AppState> = (action$) => action$
    .ofType(loggedOut.type)
    .pipe(
        map(_ => replace('/login'))
    );