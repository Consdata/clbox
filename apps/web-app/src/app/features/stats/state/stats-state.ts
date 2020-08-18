import {Stats} from './stats';

export interface StatsState {
  months: {
    [month: string]: Stats
  }
}
