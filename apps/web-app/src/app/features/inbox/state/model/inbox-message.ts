import {InboxMessageState} from './inbox-message-state';

export interface InboxMessage {
    id: string;
    from: string;
    fromName: string;
    for: string;
    forName: string;
    date: string;
    message: string;
    state: InboxMessageState;
}