import {Team} from './team';

export interface TeamState {
    current?: Team;
    teams: {
        byId: { [key: string]: Team }
    };
}