import {Draft} from '@reduxjs/toolkit';
import {AuthenticationState} from '../authentication-state';

export const clearAuthenticationStatusReducer = (state: Draft<AuthenticationState>) => {
    state.statusMessage = undefined
};