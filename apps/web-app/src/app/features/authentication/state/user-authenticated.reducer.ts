import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from './authentication-state';
import {userAuthenticated} from './user-authenticated.action';

export const userAuthenticatedReducer = (state: Draft<AuthenticationState>, action: ReturnType<typeof userAuthenticated>) => {
    state.authenticated = true;
};
