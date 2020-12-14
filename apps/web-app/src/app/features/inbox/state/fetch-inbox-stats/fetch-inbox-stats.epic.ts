import firebase from 'firebase';
import {Epic} from 'redux-observable';
import {combineLatest, Observable, of} from 'rxjs';
import {distinct, map, switchMap} from 'rxjs/operators';
import {inboxStatsFetched} from "./inbox-stats-fetched";
import {InboxStats} from "../../model/inbox-stats";
import {firebaseApp} from "../../../firebase/firebase.app";
import {loggedIn} from "../../../authentication/state/login/logged-in.action";
import {AppState} from "../../../../state/app-state";

const firestore = firebaseApp.firestore();
export const fetchInboxStatsEpic: Epic<ReturnType<typeof loggedIn>, any, AppState> = (action$, state$) => combineLatest([
  state$.pipe(
    map(state => state.authentication?.email)
  ),
  state$.pipe(
    map(state => state.team?.current?.id)
  )
]).pipe(
  distinct(([user, team]) => `${user}/${team}`),
  switchMap(([user, team]) => {
    if (team && user) {
      return new Observable<firebase.firestore.DocumentSnapshot>(subscriber => {
        const inboxFilterStatsDoc = firestore.collection(`team/${team}/user/${user}/data`).doc('inbox-filter-stats');
        inboxFilterStatsDoc.onSnapshot(subscriber);
      });
    } else {
      return of<firebase.firestore.DocumentSnapshot>();
    }
  }),
  map(doc => inboxStatsFetched({
      stats: doc.data() as InboxStats
  }))
);
