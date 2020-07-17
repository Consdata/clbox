import {Epic} from 'redux-observable';
import {EMPTY, from, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {firebaseApp} from '../../../firebase/firebase.app';
import {restoreInboxFeedback} from '../restore-inbox-feedback/restore-inbox-feedback.action';
import {discardInboxFeedback} from './discard-inbox-feedback.action';

export const discardInboxFeedbackEpic: Epic<ReturnType<typeof discardInboxFeedback>, any, AppState> = (action$, state$) => action$
    .ofType(discardInboxFeedback.type)
    .pipe(
        withLatestFrom(state$),
        switchMap(([{payload}, state]) => from(
            firebaseApp.firestore()
                .collection(`team/${state.team.current.id}/inbox/${state.authentication.email}/message`)
                .doc(payload.message.id)
                .delete()
            ).pipe(
            map(_ => EMPTY),
            catchError(error => of(restoreInboxFeedback({message: payload.message})))
            )
        )
    );