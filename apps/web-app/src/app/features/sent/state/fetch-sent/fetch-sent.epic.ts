import firebase from 'firebase';
import {Epic} from 'redux-observable';
import {combineLatest, Observable, of} from 'rxjs';
import {distinct, map, switchMap} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {loggedIn} from '../../../authentication/state/login/logged-in.action';
import {firebaseApp} from '../../../firebase/firebase.app';
import {Message} from '../../../message/model/message';
import {MessageState} from '../../../message/model/message-state';
import {sentFetched} from './sent-fetched';

const firestore = firebaseApp.firestore();
export const fetchSentEpic: Epic<ReturnType<typeof loggedIn>, any, AppState> = (action$, state$) => combineLatest([
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
      return new Observable<firebase.firestore.QuerySnapshot>(subscriber => {
        const sentCollection = firestore.collection(`team/${team}/sent/${user}/message`); // F2
        sentCollection.onSnapshot(subscriber);
      });
    } else {
      return of<firebase.firestore.QuerySnapshot>();
    }
  }),
  map(messages => sentFetched({
    messages: messages.docs.map(doc => (<Message>{
      id: doc.id,
      state: MessageState.Pending,
      ...doc.data()
    }))
  })),
);
