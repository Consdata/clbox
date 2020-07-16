import {createAction} from '@reduxjs/toolkit';
import {InboxMessage} from '../model/inbox-message';

export interface InboxFetchedPayload {
    messages: InboxMessage[]
}

export const inboxFetched = createAction<InboxFetchedPayload>('InboxFetched');