import {MessageState} from './message-state';

export interface Message {
    id: string;
    from: string;
    fromName: string;
    for: string;
    forName: string;
    date: string;
    message: string;
    type: 'personal'|'channel';
    state: MessageState;
    labels: string[];
    labelMap: {[label: string]: boolean};
}
