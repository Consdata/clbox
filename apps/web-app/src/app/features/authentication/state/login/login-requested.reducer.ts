import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from '../authentication-state';

export const loginRequestedReducer = (state: Draft<AuthenticationState>) => {
    state.authenticated = undefined
};
