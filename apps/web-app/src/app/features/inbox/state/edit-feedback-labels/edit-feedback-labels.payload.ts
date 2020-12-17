import { Message } from '../../../message/model/message';

export interface EditFeedbackLabelsPayload {
    message: Message;
    labels: string[];
}
