import {Epic} from 'redux-observable';
import {from, merge, of} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {firebaseApp} from '../../../firebase/firebase.app';
import {logoutRequested} from './logout-requested.action';
import {logout} from './logout.action';

export const logoutEpic: Epic<any, any, AppState> = (action$, state$) => action$
    .ofType(logout.type)
    .pipe(
        switchMap(({email, password}) => merge(
            of(logoutRequested()),
            from(firebaseApp.auth().signOut()).pipe(
                filter(_ => false)
            )
        ))
    );
