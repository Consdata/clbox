import {Epic} from 'redux-observable';
import {EMPTY, from, of} from 'rxjs';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {firebaseApp} from "../../../../firebase/firebase.app";
import {AppState} from "../../../../../state/app-state";
import {discardInboxFeedback} from "../../discard-inbox-feedback/discard-inbox-feedback.action";
import {restoreInboxFeedback} from "../../restore-inbox-feedback/restore-inbox-feedback.action";

export const fallbackDiscardInboxFeedbackEpic: Epic<ReturnType<typeof discardInboxFeedback>, any, AppState> = (action$, state$) => action$
    .ofType(discardInboxFeedback.type)
    .pipe(
        withLatestFrom(state$),
        switchMap(([{payload}, state]) => from(
            firebaseApp.firestore()
                .collection(`team/${state.team.current.id}/inbox/${state.authentication.email}/message`)
                .doc(payload.message.id)
                .delete()
            ).pipe(
            switchMap(_ => EMPTY),
            catchError(error => of(restoreInboxFeedback({message: payload.message})))
            )
        )
    );
