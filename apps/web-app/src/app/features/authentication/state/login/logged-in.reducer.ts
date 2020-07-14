import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from '../authentication-state';

export const loggedInReducer = (state: Draft<AuthenticationState>) => {
    state.authenticated = true;
};
