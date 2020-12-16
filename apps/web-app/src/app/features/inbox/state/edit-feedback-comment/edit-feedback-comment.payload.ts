import { Message } from '../../../message/model/message';

export interface EditFeedbackCommentPayload {
    message: Message;
    text: string;
}
