import {InboxMessage} from './model/inbox-message';

export interface InboxState {
    messages: {
        byId: { [key: string]: InboxMessage }
    };
}