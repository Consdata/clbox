import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from '../authentication-state';
import {loggedIn} from './logged-in.action';

export const loggedInReducer = (state: Draft<AuthenticationState>, action: ReturnType<typeof loggedIn>) => {
    state.authenticated = true;
    state.email = action.payload.email;
};
