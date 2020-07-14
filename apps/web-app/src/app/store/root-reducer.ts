import {combineReducers} from '@reduxjs/toolkit';
import {connectRouter} from 'connected-react-router';
import {authenticationReducer} from '../features/authentication/state/authentication.reducer';
import {teamReducer} from '../features/team/state/team.reducer';

export const rootReducer = history => combineReducers({
    router: connectRouter(history),
    authentication: authenticationReducer,
    team: teamReducer
});