import {Epic} from 'redux-observable';
import {EMPTY, from} from 'rxjs';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {firebaseApp} from "../../../firebase/firebase.app";
import {AppState} from "../../../../state/app-state";
import {editFeedbackComment} from "./edit-feedback-comment.action";

export const editFeedbackCommentEpic: Epic<ReturnType<typeof editFeedbackComment>, any, AppState> = (action$, state$) => action$
    .ofType(editFeedbackComment.type)
    .pipe(
        withLatestFrom(state$),
        switchMap(([{payload}, state]) => {
            return from(
                firebaseApp.firestore()
                    .collection(`team/${state.team.current.id}/user/${state.authentication.email}/inbox/`)
                    .doc(payload.message.id)
                    .update({
                        comments: payload.text?.trim().length > 0 ? [{text: payload.text}] : []
                    })
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
