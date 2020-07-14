import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from '../authentication-state';

export const logoutRequestedReducer = (state: Draft<AuthenticationState>) => {
    state.authenticated = undefined
};
