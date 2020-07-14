import {Epic} from 'redux-observable';
import {from, merge, of} from 'rxjs';
import {catchError, filter, map, switchMap} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {firebaseApp} from '../../../firebase/firebase.app';
import {loginError} from '../login-error/login-error.action';
import {loginRequested} from '../login/login-requested.action';
import {login} from '../login/login.action';

export const loginWithEmailEpic: Epic<any, any, AppState> = (action$, state$) => action$
    .ofType(login.type)
    .pipe(
        map((action: ReturnType<typeof login>) => action.payload),
        switchMap(({email, password}) => merge(
            of(loginRequested()),
            from(firebaseApp.auth().signInWithEmailAndPassword(email, password)).pipe(
                filter(_ => false),
                catchError(error => of(loginError({error: error.message}))),
            )
        ))
    );
