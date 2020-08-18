import {Draft} from '@reduxjs/toolkit';
import {statsFetched} from './stats-fetched';
import {StatsState} from '../stats-state';

export const statsFetchedReducer = (state: Draft<StatsState>, action: ReturnType<typeof statsFetched>) => {
  state.months[action.payload.month] = action.payload.stats;
}
