import {Draft} from '@reduxjs/toolkit';
import {inboxFetched} from './inbox-fetched';
import {InboxState} from "../inbox-state";

export const inboxFetchedReducer = (state: Draft<InboxState>, action: ReturnType<typeof inboxFetched>) => {
    state.messages = {
        byId: action.payload.messages.reduce(
            (teams, team) => ({
                ...teams,
                [team.id]: team
            }),
            {}
        )
    }
};
