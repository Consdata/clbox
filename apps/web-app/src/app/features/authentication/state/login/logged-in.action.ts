import {createAction} from '@reduxjs/toolkit';
import {LoggedInPayload} from './logged-in-payload';

export const loggedIn = createAction<LoggedInPayload>('LoggedIn');