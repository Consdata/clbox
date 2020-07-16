import {InboxMessage} from '../model/inbox-message';

export interface DiscardInboxFeedbackPayload {
    message: InboxMessage;
}