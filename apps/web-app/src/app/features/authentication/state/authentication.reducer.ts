import {createReducer} from '@reduxjs/toolkit';
import {authenticationStateInitial} from './authenication-state-initial';
import {AuthenticationState} from './authentication-state';
import {loggedIn} from './login/logged-in.action';
import {loggedInReducer} from './login/logged-in.reducer';
import {loggedOut} from './logout/logged-out.action';
import {loggedOutReducer} from './logout/logged-out.reducer';
import {logoutRequested} from './logout/logout-requested.action';
import {logoutRequestedReducer} from './logout/logout-requested.reducer';

export const authenticationReducer = createReducer<AuthenticationState>(
    authenticationStateInitial,
    builder => builder
        .addCase(loggedIn, loggedInReducer)
        .addCase(loggedOut, loggedOutReducer)
        .addCase(logoutRequested, logoutRequestedReducer)
);