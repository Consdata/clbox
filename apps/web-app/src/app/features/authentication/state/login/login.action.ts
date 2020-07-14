import {createAction} from '@reduxjs/toolkit';
import {LoginPayload} from './login.payload';

export const login = createAction<LoginPayload>('Login');