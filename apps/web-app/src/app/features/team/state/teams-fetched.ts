import {createAction} from '@reduxjs/toolkit';
import {Team} from './team';

export interface TeamsFetchedPayload {
    teams: Team[]
}

export const teamsFetched = createAction<TeamsFetchedPayload>('TeamsFetched');