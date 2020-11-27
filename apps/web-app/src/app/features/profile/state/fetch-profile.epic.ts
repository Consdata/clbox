import {Epic} from 'redux-observable';
import {combineLatest, Observable, of} from 'rxjs';
import {distinct, map, switchMap} from 'rxjs/operators';
import {AppState} from '../../../state/app-state';
import {loggedIn} from '../../authentication/state/login/logged-in.action';
import {firebaseApp} from '../../firebase/firebase.app';
import firebase from "firebase";
import {profileFetched} from "./profile-fetched";
import {Profile} from "./profile";

const firestore = firebaseApp.firestore();

export const fetchProfileEpic: Epic<ReturnType<typeof loggedIn>, any, AppState> = (action$, state$) =>
  combineLatest([
    state$.pipe(map(state => state.authentication?.email)),
    state$.pipe(map(state => state.team?.current?.id))
  ]).pipe(
    distinct(([user, team]) => `${user}/${team}`),
    switchMap(([user, team]) => {
      if (user && team) {
        return new Observable<firebase.firestore.DocumentSnapshot>(subscriber => {
          firestore.collection(`team/${team}/user`).doc(user)
            .onSnapshot(subscriber)
        });
      } else {
        return of<firebase.firestore.DocumentSnapshot>();
      }
    }),
    map(profileDoc => profileFetched({profile: profileDoc.data() as Profile}))
  );
