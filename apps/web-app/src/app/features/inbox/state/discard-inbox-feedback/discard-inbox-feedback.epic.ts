import {Epic} from 'redux-observable';
import {EMPTY, from} from 'rxjs';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {firebaseApp} from "../../../firebase/firebase.app";
import {discardInboxFeedback} from "./discard-inbox-feedback.action";
import {AppState} from "../../../../state/app-state";
import {firebaseAnalytics} from "../../../firebase/firebase.analytics";

export const discardInboxFeedbackEpic: Epic<ReturnType<typeof discardInboxFeedback>, any, AppState> = (action$, state$) => action$
    .ofType(discardInboxFeedback.type)
    .pipe(
        withLatestFrom(state$),
        switchMap(([{payload}, state]) => {
            firebaseAnalytics.logEvent('user/feedback/inbox/edit-comment');
            return from(
                firebaseApp.firestore()
                    .collection(`team/${state.team.current.id}/user/${state.authentication.email}/inbox/`)
                    .doc(payload.message.id)
                    .delete()
            ).pipe(
                switchMap(_ => EMPTY),
                catchError(error => {
                    console.error(
                        `Can't discard inbox message [team/${state.team.current.id}/user/${state.authentication.email}/inbox/${payload.message.id}]`,
                        error
                    );
                    return EMPTY;
                })
            );
        })
    );
