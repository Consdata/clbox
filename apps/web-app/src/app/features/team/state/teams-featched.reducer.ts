import {Draft} from '@reduxjs/toolkit';
import {TeamState} from './team-state';
import {teamsFetched} from './teams-fetched';

export const teamsFetchedReducer = (state: Draft<TeamState>, action: ReturnType<typeof teamsFetched>) => {
    state.current = action.payload.teams[0];
    state.teams = {
        byId: action.payload.teams.reduce(
            (teams, team) => ({
                ...teams,
                [team.id]: team
            }),
            {}
        )
    }
};