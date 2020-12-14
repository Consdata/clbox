import {createAction} from '@reduxjs/toolkit';
import {InboxStats} from "../../model/inbox-stats";

export interface InboxStatsFetchedPayload {
    stats: InboxStats
}

export const inboxStatsFetched = createAction<InboxStatsFetchedPayload>('InboxStatsFetched');
