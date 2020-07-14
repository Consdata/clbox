import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from './authentication-state';
import {userAuthenticationRevoked} from './user-authentication-revoked.action';

export const userAuthenticationRevokedReducer = (state: Draft<AuthenticationState>, action: ReturnType<typeof userAuthenticationRevoked>) => {
    state.authenticated = false;
};