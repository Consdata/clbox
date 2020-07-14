import {createReducer} from '@reduxjs/toolkit';
import {authenticationStateInitial} from './authenication-state-initial';
import {AuthenticationState} from './authentication-state';
import {clearAuthenticationStatus} from './clear-authentication-status/clear-authentication-status.action';
import {clearAuthenticationStatusReducer} from './clear-authentication-status/clear-authentication-status.reducer';
import {loginError} from './login-error/login-error.action';
import {loginErrorReducer} from './login-error/login-error.reducer';
import {loggedIn} from './login/logged-in.action';
import {loggedInReducer} from './login/logged-in.reducer';
import {loginRequested} from './login/login-requested.action';
import {loginRequestedReducer} from './login/login-requested.reducer';
import {loggedOut} from './logout/logged-out.action';
import {loggedOutReducer} from './logout/logged-out.reducer';
import {logoutRequested} from './logout/logout-requested.action';
import {logoutRequestedReducer} from './logout/logout-requested.reducer';

export const authenticationReducer = createReducer<AuthenticationState>(
    authenticationStateInitial,
    builder => builder
        .addCase(loggedIn, loggedInReducer)
        .addCase(loginRequested, loginRequestedReducer)
        .addCase(loggedOut, loggedOutReducer)
        .addCase(logoutRequested, logoutRequestedReducer)
        .addCase(loginError, loginErrorReducer)
        .addCase(clearAuthenticationStatus, clearAuthenticationStatusReducer)
);