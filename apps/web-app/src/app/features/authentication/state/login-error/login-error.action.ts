import {createAction} from '@reduxjs/toolkit';
import {LoginErrorPayload} from './login-error-payload';

export const loginError = createAction<LoginErrorPayload>('LoginError');