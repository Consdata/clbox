import firebase from 'firebase';
import {Epic} from 'redux-observable';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {loggedIn} from '../../../authentication/state/login/logged-in.action';
import {firebaseApp} from '../../../firebase/firebase.app';
import {teamsFetched} from '../../../team/state/teams-fetched';
import {Stats} from '../stats';
import {statsFetched} from './stats-fetched';

const firestore = firebaseApp.firestore();
const currentMonth = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 7);
export const fetchStatsEpic: Epic<ReturnType<typeof loggedIn>, any, AppState> = (action$, state$) => {
  return action$
    .ofType(teamsFetched.type)
    .pipe(
      withLatestFrom(state$),
      filter(([_, state]) => !state.stats.months[currentMonth]),
      switchMap(([_, state]) => new Observable<firebase.firestore.DocumentSnapshot>(subscriber => {
        const monthStats = firestore.collection(`team/${state.team.current.id}/stats`).doc(currentMonth);
        monthStats.onSnapshot(subscriber)
      })),
      map(stats => statsFetched({
        month: currentMonth,
        stats: stats.data() as Stats
      }))
    );
};
