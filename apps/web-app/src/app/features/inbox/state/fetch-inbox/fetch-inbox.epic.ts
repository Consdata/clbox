import firebase from 'firebase';
import {Epic} from 'redux-observable';
import {combineLatest, Observable} from 'rxjs';
import {distinct, filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {loggedIn} from '../../../authentication/state/login/logged-in.action';
import {loggedOut} from '../../../authentication/state/logout/logged-out.action';
import {firebaseApp} from '../../../firebase/firebase.app';
import {InboxMessage} from '../model/inbox-message';
import {InboxMessageState} from '../model/inbox-message-state';
import {inboxFetched} from './inbox-fetched';

const firestore = firebaseApp.firestore();
export const fetchInboxEpic: Epic<ReturnType<typeof loggedIn>, any, AppState> = (action$, state$) => combineLatest([action$.ofType(loggedIn.type), state$])
  .pipe(
    filter(([_, state]) => state.team?.current?.id !== undefined),
    distinct(([action, state]) => `${action.payload.email}/${state.team.current.id}`),
    tap(([action, state]) => console.log({action, state})),
    switchMap(([action, state]) => new Observable<firebase.firestore.QuerySnapshot>(subscriber => {
      const inboxCollection = firestore.collection(`team/${state.team.current.id}/inbox/${action.payload.email}/message`);
      inboxCollection.onSnapshot(subscriber);
    })),
    takeUntil(action$.ofType(loggedOut)),
    map(messages => inboxFetched({
      messages: messages.docs.map(doc => (<InboxMessage>{
        id: doc.id,
        state: InboxMessageState.Pending,
        ...doc.data()
      }))
    })),
  );
