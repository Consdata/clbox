import {createReducer} from '@reduxjs/toolkit';
import {authenticationStateInitial} from './authenication-state-initial';
import {AuthenticationState} from './authentication-state';
import {userAuthenticated} from './user-authenticated.action';
import {userAuthenticatedReducer} from './user-authenticated.reducer';
import {userAuthenticationRevoked} from './user-authentication-revoked.action';
import {userAuthenticationRevokedReducer} from './user-authentication-revoked.reducer';

export const authenticationReducer = createReducer<AuthenticationState>(
    authenticationStateInitial,
    builder => builder
        .addCase(userAuthenticated, userAuthenticatedReducer)
        .addCase(userAuthenticationRevoked, userAuthenticationRevokedReducer)
);