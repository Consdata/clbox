import {createAction} from '@reduxjs/toolkit';
import {Message} from "../../../message/model/message";

export interface InboxFetchedPayload {
    messages: Message[]
}

export const inboxFetched = createAction<InboxFetchedPayload>('InboxFetched');
