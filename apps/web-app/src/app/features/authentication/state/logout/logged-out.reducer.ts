import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from '../authentication-state';

export const loggedOutReducer = (state: Draft<AuthenticationState>) => {
    state.authenticated = false;
    state.email = undefined;
};