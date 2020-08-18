import {createAction} from '@reduxjs/toolkit';
import {Stats} from '../stats';

export interface StatsFetchedPayload {
  month: string;
  stats: Stats;
}

export const statsFetched = createAction<StatsFetchedPayload>('StatsFetched');
