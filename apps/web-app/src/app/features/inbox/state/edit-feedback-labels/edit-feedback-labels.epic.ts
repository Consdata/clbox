import {Epic} from 'redux-observable';
import {EMPTY, from} from 'rxjs';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {firebaseApp} from "../../../firebase/firebase.app";
import {AppState} from "../../../../state/app-state";
import {editFeedbackLabels} from "./edit-feedback-labels.action";
import {firebaseAnalytics} from "../../../firebase/firebase.analytics";

export const editFeedbackLabelsEpic: Epic<ReturnType<typeof editFeedbackLabels>, any, AppState> = (action$, state$) => action$
    .ofType(editFeedbackLabels.type)
    .pipe(
        withLatestFrom(state$),
        switchMap(([{payload}, state]) => {
            firebaseAnalytics.logEvent('user/feedback/inbox/edit-labels');
            return from(
                firebaseApp.firestore()
                    .collection(`team/${state.team.current.id}/user/${state.authentication.email}/inbox/`)
                    .doc(payload.message.id)
                    .update({
                        labels: payload.labels,
                        labelMap: payload.labels.reduce((map, label) => ({...map, [label]: true}), {})
                    })
            ).pipe(
                switchMap(_ => EMPTY),
                catchError(error => {
                    console.error(
                        `Can't change inbox message labels [team/${state.team.current.id}/user/${state.authentication.email}/inbox/${payload.message.id}]`,
                        error
                    );
                    return EMPTY;
                })
            );
        })
    );
