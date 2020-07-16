import {Epic} from 'redux-observable';
import {EMPTY, of} from 'rxjs';
import {delay, switchMap, tap} from 'rxjs/operators';
import {AppState} from '../../../../state/app-state';
import {restoreInboxFeedback} from '../restore-inbox-feedback/restore-inbox-feedback.action';
import {discardInboxFeedback} from './discard-inbox-feedback.action';

export const discardInboxFeedbackEpic: Epic<ReturnType<typeof discardInboxFeedback>, any, AppState> = (action$, state$) => action$
    .ofType(discardInboxFeedback.type)
    .pipe(
        tap(action => console.log(action)),
        delay(5000),
        switchMap(
            action => action.payload.message.from === 'jadams@usa.com' ? of(restoreInboxFeedback({message: action.payload.message})) : EMPTY
        )
    );