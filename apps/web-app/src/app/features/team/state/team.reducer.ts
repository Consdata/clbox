import {createReducer} from '@reduxjs/toolkit';
import {TeamState} from './team-state';
import {teamStateInitial} from './team-state-initial';
import {teamsFetchedReducer} from './teams-featched.reducer';
import {teamsFetched} from './teams-fetched';

export const teamReducer = createReducer<TeamState>(
    teamStateInitial,
    builder => builder
        .addCase(teamsFetched, teamsFetchedReducer)
)