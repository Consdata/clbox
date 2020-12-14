import {Message} from '../../message/model/message';
import {InboxStats} from "../model/inbox-stats";

export interface InboxState {
    messages: {
        byId: { [key: string]: Message }
    };
    stats: InboxStats;
}
