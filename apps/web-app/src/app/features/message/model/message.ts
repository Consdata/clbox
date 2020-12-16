import {MessageComment} from "./message-comment";

export interface Message {
    id: string;
    from: string;
    fromName: string;
    for: string;
    forName: string;
    date: string;
    message: string;
    type: 'personal' | 'channel';
    labels: string[];
    labelMap: { [label: string]: boolean };
    comments: MessageComment[];
}
