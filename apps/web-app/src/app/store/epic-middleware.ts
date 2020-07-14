import {createEpicMiddleware} from 'redux-observable';
import {AppState} from '../state/app-state';

export const epicMiddleware = createEpicMiddleware<any, any, AppState>();