import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from '../authentication-state';
import {loginError} from './login-error.action';

export const loginErrorReducer = (state: Draft<AuthenticationState>, {payload}: ReturnType<typeof loginError>) => {
    state.authenticated = false;
    state.statusMessage = payload.error;
};
