import {replace} from 'connected-react-router';
import {Epic} from 'redux-observable';
import {of} from 'rxjs';
import {switchMap, withLatestFrom} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {loggedIn} from './logged-in.action';

export const redirectAfterLogin: Epic<any, any, AppState> = (action$, state$) => action$
  .ofType(loggedIn.type)
  .pipe(
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      if (state.router.location.pathname === '/login') {
        return of(replace('/inbox'));
      } else {
        return of();
      }
    })
  );
